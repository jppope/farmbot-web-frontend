import { generateReducer } from "../redux/generate_reducer";
import { DeprecatedSync } from "../interfaces";
import { RestResources, ResourceIndex } from "./interfaces";
import { TaggedResource, ResourceName } from "./tagged_resources";
import { uuid } from "farmbot/dist";

let initialState: RestResources = {
  loaded: false,
  index: {
    all: [],
    byKind: {
      device: [],
      farm_events: [],
      images: [],
      logs: [],
      peripherals: [],
      plants: [],
      points: [],
      regimen_items: [],
      regimens: [],
      sequences: [],
      tool_bays: [],
      tool_slots: [],
      tools: [],
      users: []
    },
    byKindAndId: {},
    references: {}
  }
}

/** Responsible for all RESTful resources. */
export let resourceReducer = generateReducer<RestResources>(initialState)
  .add<TaggedResource>("INITIALIZE_RESOURCE", function (s, a) {
    let tr = a.payload;
    addToIndex(s.index, tr.kind, tr.body, tr.uuid)
    return s;
  })
  .add<TaggedResource>("CREATE_RESOURCE_OK", function (state, action) {
    let resource = action.payload;
    if (resource
      && resource.body
      && resource.body.id) {
      switch (resource.kind) {
        case "farm_events":
        case "plants":
        case "regimens":
        case "sequences":
        case "tool_slots":
        case "tools":
          state.index.references[resource.uuid] = resource;
        default:
          whoops("CREATE_RESOURCE_OK", action.payload.kind);
      }
    } else {
      throw new Error("Somehow, a resource was created without an ID?");
    }
    return state;
  })
  .add<TaggedResource>("DESTROY_RESOURCE_OK", function (state, action) {
    let resource = action.payload;
    switch (resource.kind) {
      case "farm_events":
      case "plants":
      case "regimens":
      case "sequences":
      case "tools":
        removeFromIndex(state.index, resource);
        break;
      default:
        whoops("DESTROY_RESOURCE_OK", action.payload.kind);
    }
    return state;
  })
  .add<DeprecatedSync>("FETCH_SYNC_OK", function (state, action) {
    let p = action.payload;
    let { index } = state;
    // TODO: Try doing something fancier.
    addAllToIndex(index, "farm_events", p["farm_events"]);
    addAllToIndex(index, "images", p["images"]);
    addAllToIndex(index, "logs", p["logs"]);
    addAllToIndex(index, "peripherals", p["peripherals"]);
    addAllToIndex(index, "plants", p["plants"]);
    addAllToIndex(index, "points", p["points"]);
    addAllToIndex(index, "regimen_items", p["regimen_items"]);
    addAllToIndex(index, "regimens", p["regimens"]);
    addAllToIndex(index, "sequences", p["sequences"]);
    addAllToIndex(index, "tool_bays", p["tool_bays"]);
    addAllToIndex(index, "tool_slots", p["tool_slots"]);
    addAllToIndex(index, "tools", p["tools"]);
    addAllToIndex(index, "users", p["users"]);
    return state;
  });

function addAllToIndex<T>(i: ResourceIndex, kind: ResourceName, all: T[]) {
  all.map(tr => addToIndex(i, kind, tr, uuid()));
}
let x = uuid()
function addToIndex<T>(index: ResourceIndex,
  kind: ResourceName,
  body: T,
  uuid: string) {
  let tr: TaggedResource = { kind, body, uuid } as any; // TODO: Fix this :(
  index.all.push(tr.uuid);
  index.byKind[tr.kind].push(tr.uuid);
  if (tr.body.id) { index.byKindAndId[tr.kind + "." + tr.body.id] = tr.uuid; }
  index.references[tr.uuid] = tr;
}

let removeUUID = (tr: TaggedResource) => (uuid: string) => uuid === tr.uuid;

function removeFromIndex(index: ResourceIndex, tr: TaggedResource) {
  index.all = index.all.filter(removeUUID(tr));
  index.byKind[tr.kind].filter(removeUUID(tr));
  if (tr.body.id) { delete index.byKindAndId[tr.kind + "." + tr.body.id] }
  delete index.references[tr.uuid];
}

function whoops(origin: string, kind: string) {
  let msg = `${origin}/${kind}: No handler written for this one yet.`
  throw new Error(msg);
}

export function findByUuid(index: ResourceIndex, uuid: string): TaggedResource {
  let x = index.references[uuid];
  if (_.isUndefined(x)) {
    throw new Error("BAD UUID- CANT FIND RESOURCE: " + uuid);
  } else {
    return x as TaggedResource;
  }
}