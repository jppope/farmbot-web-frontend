import * as React from "react";
import { CalibrationRow } from "./calibration_button";
import { t } from "i18next";
import { McuInputBox } from "./mcu_input_box";
import { BotConfigInputBox } from "./step_per_mm_box";
import { settingToggle, botConfigChange, MCUFactoryReset } from "../actions";
import { ToggleButton } from "../../controls/toggle_button";
import { Widget, WidgetHeader, WidgetBody } from "../../ui/index";
import { HardwareSettingsProps } from "../interfaces";
import { HomingRow } from "./homing_row";
import { EncoderType } from "./encoder_type";
import { MustBeOnline } from "../must_be_online";
import { ZeroRow } from "./zero_row";
import { SaveBtn } from "../../ui/save_button";

export class HardwareSettings extends React.Component<HardwareSettingsProps, {}> {
  render() {
    let { bot, dispatch } = this.props;
    let { mcu_params } = bot.hardware;
    return <Widget className="hardware-widget">
      <WidgetHeader title="Hardware"
        helpText={`Change settings
                  of your FarmBot hardware with the fields below.
                  Caution: Changing these settings to extreme
                  values can cause hardware malfunction. Make
                  sure to test any new settings before letting
                  your FarmBot use them unsupervised. Tip: Recalibrate
                  FarmBot after changing settings and test a few sequences
                  to verify that everything works as expected. Note:
                  Currently not all settings can be changed.`}>
        <MustBeOnline fallback=" "
          status={bot.hardware.informational_settings.sync_status}
          lockOpen={process.env.NODE_ENV !== "production"}>
          <SaveBtn
            isDirty={false}
            isSaving={bot.isUpdating}
            isSaved={!bot.isUpdating}
            dirtyText={" "}
            savingText={"Updating..."}
            savedText={"saved"}
            /** Optional boolean for whether the button should be hidden or shown */
            hidden={false} />
        </MustBeOnline>
      </WidgetHeader>
      <WidgetBody>
        <MustBeOnline fallback="Device is offline."
          status={bot.hardware.informational_settings.sync_status}
          lockOpen={process.env.NODE_ENV !== "production"}>
          <table className="plain">
            <thead>
              <tr>
                <th width="38%" />
                <th width="20%">
                  <label>{t("X AXIS")}</label>
                </th>
                <th width="20%">
                  <label>{t("Y AXIS")}</label>
                </th>
                <th width="20%">
                  <label>{t("Z AXIS")}</label>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label>{t("Steps per MM")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`The number of motor steps required to move the axis
                        one millimeter.`)}
                    </div>
                  </div>
                </td>
                <BotConfigInputBox setting="steps_per_mm_x"
                  bot={bot}
                  dispatch={dispatch} />
                <BotConfigInputBox setting="steps_per_mm_y"
                  bot={bot}
                  dispatch={dispatch} />
                <BotConfigInputBox setting="steps_per_mm_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td>
                  <label>{t("MAX SPEED (steps/s)")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Maximum travel speed after acceleration
                        in motor steps per second.`)}
                    </div>
                  </div>
                </td>
                <McuInputBox setting="movement_max_spd_x"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_max_spd_y"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_max_spd_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td>
                  <label>{t("ACCELERATE FOR (steps)")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Number of steps used for acceleration
                        and deceleration.`)}
                    </div>
                  </div>
                </td>
                <McuInputBox setting="movement_steps_acc_dec_x"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_steps_acc_dec_y"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_steps_acc_dec_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td>
                  <label>{t("TIMEOUT AFTER (seconds)")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Amount of time to wait for a command to
                        execute before stopping.`)}
                    </div>
                  </div>
                </td>
                <McuInputBox setting="movement_timeout_x"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_timeout_y"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_timeout_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td>
                  <label>{t("LENGTH (mm)")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Coming Soon! Set the length of each axis to provide
                        software limits.`)}
                    </div>
                  </div>
                </td>
                <McuInputBox setting="movement_axis_nr_steps_x"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_axis_nr_steps_y"
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting="movement_axis_nr_steps_z"
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <CalibrationRow hardware={mcu_params} />
              <HomingRow hardware={mcu_params} />
              <ZeroRow />
              <tr>
                <td>
                  <label>{t("INVERT ENDPOINTS")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Swap axis end-stops during calibration.`)}
                    </div>
                  </div>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_endpoints_x}
                    toggleAction={() =>
                      settingToggle("movement_invert_endpoints_x",
                        bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_endpoints_y}
                    toggleAction={() =>
                      settingToggle("movement_invert_endpoints_y",
                        bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_endpoints_z}
                    toggleAction={() =>
                      settingToggle("movement_invert_endpoints_z",
                        bot)} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("INVERT MOTORS")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Invert direction of motor during calibration.`)}
                    </div>
                  </div>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_motor_x}
                    toggleAction={() => settingToggle("movement_invert_motor_x", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_motor_y}
                    toggleAction={() => settingToggle("movement_invert_motor_y", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_invert_motor_z}
                    toggleAction={() => settingToggle("movement_invert_motor_z", bot)} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("NEGATIVE COORDINATES ONLY")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Restrict travel to negative coordinate locations.`)}
                    </div>
                  </div>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_home_up_x}
                    toggleAction={() => settingToggle("movement_home_up_x", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_home_up_y}
                    toggleAction={() => settingToggle("movement_home_up_y", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_home_up_z}
                    toggleAction={() => settingToggle("movement_home_up_z", bot)} />
                </td>
              </tr>

              <tr>
                <td>
                  <label>{t("ENABLE ENDSTOPS")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Enable use of electronic end-stops during
                        calibration and homing.`)}
                    </div>
                  </div>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_enable_endpoints_x}
                    toggleAction={() => settingToggle("movement_enable_endpoints_x", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_enable_endpoints_y}
                    toggleAction={() => settingToggle("movement_enable_endpoints_y", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_enable_endpoints_z}
                    toggleAction={() => settingToggle("movement_enable_endpoints_z", bot)} />
                </td>
              </tr>
              <tr>
                <td colSpan={100}>
                  <small>
                    Firmware-level support for rotary encoders is still under development.
                </small>
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("ENABLE ENCODERS")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`(Alpha) Enable use of rotary encoders during
                        calibration and homing.`)}
                    </div>
                  </div>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.encoder_enabled_x}
                    toggleAction={() => settingToggle("encoder_enabled_x", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.encoder_enabled_y}
                    toggleAction={() => settingToggle("encoder_enabled_y", bot)} />
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.encoder_enabled_z}
                    toggleAction={() => settingToggle("encoder_enabled_z", bot)} />
                </td>
              </tr>

              {/*}
              <EncoderType hardware={mcu_params}
                onChange={(x, y) => { botConfigChange(x, y) }} />
              */}

              <tr>
                <td>
                  <label>{t("ENCODER SCALING")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`(Alpha) Position = encoder_steps * scale_factor / 100.`)}
                    </div>
                  </div>
                </td>
                <McuInputBox setting={"encoder_scaling_x"}
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting={"encoder_scaling_y"}
                  bot={bot}
                  dispatch={dispatch} />
                <McuInputBox setting={"encoder_scaling_z"}
                  bot={bot}
                  dispatch={dispatch} />
              </tr>
              <tr>
                <td colSpan={100}>
                  <small>
                    Second X Motor
                </small>
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("ENABLE MOTOR")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Enable use of a second x-axis motor.
                        Connects to E0 on RAMPS.`)}
                    </div>
                  </div>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_secondary_motor_x}
                    toggleAction={() => settingToggle("movement_secondary_motor_x", bot)} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{t("INVERT MOTOR")}</label>
                  <div className="help">
                    <i className="fa fa-question-circle help-icon" />
                    <div className="help-text">
                      {t(`Change the direction of the motor during calibration.`)}
                    </div>
                  </div>
                </td>
                <td>
                  <ToggleButton
                    toggleval={mcu_params.movement_secondary_motor_invert_x}
                    toggleAction={() => settingToggle("movement_secondary_motor_invert_x",
                      bot)} />
                </td>
              </tr>
              <tr>
                <td>
                  <label>RESET HARDWARE PARAMETER DEFAULTS</label>
                </td>
                <td colSpan={2}>
                  <p>
                    Restoring hardware parameter defaults will destroy the
                  current settings, resetting them to default values.
                  <b>Will reboot device.</b>
                  </p>
                </td>
                <td>
                  <button className="red" onClick={() => MCUFactoryReset()}>
                    {t("RESET")}
                  </button>
                </td>
              </tr>


            </tbody>
          </table>
        </MustBeOnline>
      </WidgetBody>
    </Widget>;
  }
}
