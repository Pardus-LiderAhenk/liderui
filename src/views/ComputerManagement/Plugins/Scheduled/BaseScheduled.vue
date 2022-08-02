<template>
  <div>
    <Dialog 
      :header='$t("computer.scheduled.title")' 
      v-model:visible="showDialog" 
      :modal="true" 
      :style="{width: '25vw'}" 
    >
      <template #default>
        <div class="p-fluid">
          <div class="p-field p-grid">
            <label class="p-col-12 p-mb-2 p-md-4 p-mb-md-0">{{ $t('computer.scheduled.schedule') }}</label>
            <div class="p-col-12 p-md-8">
              <Dropdown v-model="selected" 
                :options="scheduledOptions" 
                @change="scheduledSelection" 
                optionLabel="label" style="width: 100%; margin-bottom:4px"
              />
            </div>
          </div>
          <div class="p-field p-grid">
            <label class="p-col-12 p-mb-2 p-md-4 p-mb-md-0" >{{ $t('computer.scheduled.minute') }}</label>
            <div class="p-col-12 p-md-8">
              <div>
                <InputText 
                  v-model="scheduleForm.minute" 
                  :class="validationErrors.minute ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                  placeholder="*"
                />
              </div>
              <div>
                <small v-show="validationErrors.minute" class="p-error">
                  {{ $t('computer.scheduled.minute_rule') }}
                </small>
              </div>
            </div>
          </div>
          <div class="p-field p-grid">
            <label class="p-col-12 p-mb-2 p-md-4 p-mb-md-0" >{{ $t('computer.scheduled.hour') }}</label>
            <div class="p-col-12 p-md-8">
              <div>
                <InputText 
                  v-model="scheduleForm.hour" 
                  :class="validationErrors.hour ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                  placeholder="*"
                />
              </div>
              <div>
                <small v-show="validationErrors.hour" class="p-error">
                  {{ $t('computer.scheduled.hour_rule') }}
                </small>
              </div>
            </div>
          </div>
          <div class="p-field p-grid">
            <label class="p-col-12 p-mb-2 p-md-4 p-mb-md-0">{{ $t('computer.scheduled.day_of_month') }}</label>
            <div class="p-col-12 p-md-8">
              <div>
                <InputText 
                  v-model="scheduleForm.dayOfMonth" 
                  :class="validationErrors.dayOfMonth ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                  placeholder="*"
                />
              </div>
              <div>
                <small 
                  v-show="validationErrors.dayOfMonth" 
                  class="p-error">{{ $t('computer.scheduled.day_of_month_rule') }}</small>
              </div>
            </div>
          </div>
          <div class="p-field p-grid">
            <label class="p-col-12 p-mb-2 p-md-4 p-mb-md-0" >{{ $t('computer.scheduled.month') }}</label>
            <div class="p-col-12 p-md-8">
              <div>
                <InputText 
                  v-model="scheduleForm.month" 
                  :class="validationErrors.month ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                  placeholder="*"
                />
              </div>
              <div>
                <small 
                  v-show="validationErrors.month" 
                  class="p-error">{{ $t('computer.scheduled.month_rule') }}
                </small>
              </div>
            </div>
          </div>
          <div class="p-field p-grid">
            <label class="p-col-12 p-mb-2 p-md-4 p-mb-md-0" >{{ $t('computer.scheduled.day_of_week') }}</label>
            <div class="p-col-12 p-md-8">
              <div>
                <InputText 
                  v-model="scheduleForm.dayOfWeek"
                  :class="validationErrors.dayOfWeek ? 'p-invalid p-inputtext-sm': 'p-inputtext-sm'" 
                  placeholder="*"
                />
              </div>
              <div>
                <small 
                  v-show="validationErrors.dayOfWeek" class="p-error">
                  {{ $t('computer.scheduled.day_of_week_rule') }}
                </small>
              </div>
            </div>
          </div>
          <div class="p-field p-grid">
            <label class="p-col-12 p-mb-2 p-md-4 p-mb-md-0" >{{ $t('computer.scheduled.date') }}</label>
            <div class="p-col-12 p-md-8">
              <div>
                <Calendar id="buttonbar" dateFormat="dd.mm.yy"
                  v-model="scheduleForm.date" 
                  :showButtonBar="true" :showIcon="true" 
                  :disabled="selected.value == 'custom' || selected.value == 'once' ? false : true"
                  @date-select="changeDate"
                  @clear-click="scheduleForm.dayOfMonth=''; scheduleForm.month=''">
                </Calendar>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="p-d-flex p-jc-between">
          <div>
            <a class="primary" type="secondary" 
              @click="toggle" 
              v-tooltip.bottom="$t('computer.scheduled.title')">
              <i class="fas fa-info-circle" ></i>
            </a>
            <OverlayPanel 
              ref="op" appendTo="body" 
              :showCloseIcon="false" id="overlay_panel" 
              style="width: 450px" 
              :breakpoints="{'960px': '75vw'}">
              <div><h5>{{ $t('computer.scheduled.title') }}</h5></div>
              <div><small>- - - - - - - - ->&nbsp; {{$t('computer.scheduled.minute')}} (0-59)</small></div>
              <div><small>| &nbsp;  - - - - - - - >&nbsp; {{$t('computer.scheduled.hour')}} (0-23)</small></div>
              <div><small>| &nbsp;| &nbsp; - - - - - ->&nbsp; {{$t('computer.scheduled.day_of_month')}} (1-31)</small></div>
              <div><small>| &nbsp;| &nbsp;|   - - - - - ->&nbsp; {{$t('computer.scheduled.month')}} (1-12)</small></div>
              <div><small>| &nbsp;| &nbsp;| &nbsp;| &nbsp;- - - - >&nbsp; {{$t('computer.scheduled.day_of_week')}} (0-6)</small></div>
              <div><small>| &nbsp;| &nbsp;| &nbsp;| &nbsp;|</small></div>
              <div><small style="font-weight:bold">* * * * * username command</small></div>
              <div><small>{{$t('computer.scheduled.example')}}</small></div>
              <div>
                <i class="pi pi-link"></i>&nbsp;
                <a 
                  href="https://docs.liderahenk.org/lider3.0/computerManagement/crontabManagement/" 
                  type="primary" target="_blank">
                  {{$t('computer.plugins.plugin_popover.for_more_info')}}...
                </a>
              </div>
            </OverlayPanel>
            <small class="info">&nbsp;{{$t('computer.scheduled.parameters')}}:&nbsp;</small><small>&nbsp;{{scheduledParam}}&nbsp;&nbsp;</small>
          </div>
          <div>
            <Button 
              @click="showDialog = false" 
              icon="pi pi-times" 
              class="p-button-sm p-button-text" 
              :label="$t('computer.scheduled.cancel')">
            </Button>
            <Button 
              @click="scheduledTaskOperation" 
              icon="pi pi-save" 
              class="p-button-sm" 
              :label="$t('computer.scheduled.save')">
            </Button>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
/**
 * scheduler component (crontab expression) page for scheduled tasks.
 * @author Tuncay Çolak <tuncay.colak@tubitak.gov.tr>
 * @see {@link http://www.liderahenk.org/}
 */

export default {
  props: {
    showScheduled: {
      type: Boolean,
      default: false,
      description: "New policy added",
    },
  },

  data() {
    return {
      scheduledParam: null,
      validationErrors: {},
      scheduleForm: {
        minute: "",
        hour: "",
        dayOfMonth: "",
        month: "",
        dayOfWeek: "",
        date: new Date()
      },
      scheduledOptions: [
        {label: this.$t('computer.scheduled.custom'), value: 'custom'},
        {label: this.$t('computer.scheduled.yearly'), value: 'yearly'},
        {label: this.$t('computer.scheduled.monthly'), value: 'monthly'},
        {label: this.$t('computer.scheduled.weekly'), value: 'weekly'},
        {label: this.$t('computer.scheduled.daily'), value: 'daily'},
        {label: this.$t('computer.scheduled.hourly'), value: 'hourly'},
        {label: this.$t('computer.scheduled.once'), value: 'once'}
      ],
      selected: {label: this.$t('computer.scheduled.custom'), value: 'custom'},
    };
  },

  computed: {
    showDialog: {
      get () {
        return this.showScheduled;
      },

      set (value) {
        if (!value) {
            this.$emit('closeScheduled');
        }
      }
    }
  },

  // mounted() {
  //   this.scheduleForm.minute = "";
  //   this.scheduleForm.hour = "";
  //   this.scheduleForm.dayOfMonth = "";
  //   this.scheduleForm.month = "";
  //   this.scheduleForm.dayOfWeek = "";
  //   Object.keys(this.validationErrors).forEach(key => {
  //     delete this.validationErrors[key];
  //   });
  // },
  
  methods: {
    /**
     * saveScheduled and closeScheduled event emit when click Save and Cancel buttons.
     * @event saveScheduled
     */
    scheduledTaskOperation() {
      if (this.validateForm()) {
        this.$emit("saveScheduled", this.getScheduleParam());
        this.showDialog = false;
        this.$toast.add({
          severity:'info', 
          detail: this.$t("computer.scheduled.save_scheduled_task"), 
          summary:this.$t("computer.task.toast_summary"), 
          life: 3000});
        // this.$refs["scheduleForm"].resetFields();
      }
    },

    toggle(event) {
      this.$refs.op.toggle(event);
    },

    getScheduleParam() {
      if (this.selected == "custom" || this.selected == "once") {
        this.scheduledParam = this.scheduleForm.minute +" "+ 
        this.scheduleForm.hour + " " + 
        this.scheduleForm.dayOfMonth + " " + 
        this.scheduleForm.month + " " + 
        this.scheduleForm.dayOfWeek + " " + 
        this.scheduleForm.date.getFullYear();
      } else {
          this.scheduledParam = this.scheduleForm.minute +" "+ 
          this.scheduleForm.hour + " " + 
          this.scheduleForm.dayOfMonth + " " + 
          this.scheduleForm.month + " " + 
          this.scheduleForm.dayOfWeek;
      }
      return this.scheduledParam;
    },

    scheduledSelection() {
      if (this.selected.value == "yearly") {
        this.setScheduleParameters("0", "0", "1", "1", "*");
      } else if (this.selected.value == "monthly") {
        this.setScheduleParameters("0", "0", "1", "*", "*");
      } else if (this.selected.value == "weekly") {
        this.setScheduleParameters("0", "0", "*", "*", "0");
      } else if (this.selected.value == "daily") {
        this.setScheduleParameters("0", "0", "*", "*", "*");
      } else if (this.selected.value == "hourly") {
        this.setScheduleParameters("0", "*", "*", "*", "*");
      } else if (this.selected.value == "custom") {
        this.setScheduleParameters("", "", "", "", "");
      } else if (this.selected.value == "once") {
        const date = new Date();
        this.setScheduleParameters(date.getMinutes(), date.getHours(),	date.getDate(), date.getMonth() + 1, "*");
      }
    },

    setScheduleParameters(min, hour, dOfMonth, month, dOfWeek) {
      this.scheduleForm.minute = min.toString();
      this.scheduleForm.hour = hour.toString();
      this.scheduleForm.dayOfMonth = dOfMonth.toString();
      this.scheduleForm.month = month.toString();
      this.scheduleForm.dayOfWeek = dOfWeek.toString();
    },

    changeDate() {
      const date = this.scheduleForm.date;
      this.scheduleForm.dayOfMonth = date.getDate().toString();
      this.scheduleForm.month = (date.getMonth() + 1).toString();
    },

    validateForm() {
      if (!this.scheduleForm.minute.trim()){
        this.validationErrors['minute'] = true;
      }
      else{
        delete this.validationErrors['minute'];
      }
      if (!this.scheduleForm.hour.trim()){
        this.validationErrors['hour'] = true;
      }
      else{
        delete this.validationErrors['hour'];
      }
      if (!this.scheduleForm.dayOfMonth.trim()){
        this.validationErrors['dayOfMonth'] = true;
      }
      else{
        delete this.validationErrors['dayOfMonth'];
      }
      if (!this.scheduleForm.month.trim()){
        this.validationErrors['month'] = true;
      }
      else{
        delete this.validationErrors['month'];
      }
      if (!this.scheduleForm.dayOfWeek.trim()){
        this.validationErrors['dayOfWeek'] = true;
      }
      else{
        delete this.validationErrors['dayOfWeek'];
      }
      return !Object.keys(this.validationErrors).length;
    }
  },

  watch: {
    scheduleForm: {
      handler(){
        this.validateForm();
        this.getScheduleParam();
     },
     deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>

.modal-title{
  width: 100%;
  text-align: center;
}
.info{
  font-weight:bold;
}

</style>
