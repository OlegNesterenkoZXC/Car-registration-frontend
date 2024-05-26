<template>
  <v-menu
    ref="menu"
    v-model="menu"
    transition="scale-transition"
    offset-y
    min-width="auto"
    :close-on-content-click="false"
    :return-value.sync="dates"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="dateRangeText"
        prepend-icon="mdi-calendar"
        readonly
        :disabled="disabled"
        required
        v-bind="attrs"
        v-on="on"
        :label="label"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="dates"
      no-title
      scrollable
      locale="ru-ru"
      range
      :first-day-of-week="1"
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="menu = false"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="saveHandler"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Выбор даты'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    defaultDates: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      menu: false,
      dates: []
    }
  },
  watch: {
    datesLength (val) {
      if (val === 2) {
        this.changeDatesOrder()
      }
    },
    defaultDatesString:{
      immediate: true,
      handler () {
        this.init()
      }
    }
  },
  computed: {
    datesLength () {
      return this.dates.length
    },
    defaultDatesString () {
      return `${this.defaultDates?.start}${this.defaultDates?.end}`
    },
    dateRangeText () {
      if (this.dates.length === 0) {
        return ''
      }
      
      const dates = this.dates.map((date) => {
        return this.formatDate(date)
      })

      const [start, end] = dates

      if (start && end) {
        return `с ${start} по ${end}` 
      }

      if (start && !end) {
        return `с ${start}` 
      }
      if (!start && end) {
        return `по ${end}` 
      }
    }
  },
  methods: {
    init () {
      this.dates = []

      const defaultStart = this.defaultDates?.start
      const defaultEnd = this.defaultDates?.end

      if (defaultStart && defaultEnd) {
        this.dates[0] = this.parseDate(defaultStart)
        this.dates[1] = this.parseDate(defaultEnd)

        return
      } 

      if (defaultStart) {
        this.dates[0] = this.parseDate(defaultStart)

        return
      }

      if (defaultEnd) {
        this.dates[1] = this.parseDate(defaultEnd)

        return
      }
    },
    saveHandler () {
      this.$refs.menu.save(this.dates)

      this.changeDatesOrder()

      this.$emit('change', this.dates)
    },
    changeDatesOrder () {
      if (this.dates[0] && this.dates[1] && this.dates[0] > this.dates[1]) {
        [this.dates[0], this.dates[1]] = [this.dates[1], this.dates[0]]
      }
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}-${month}-${year}`
    },
    parseDate (date) {
      if (!date) return null
      const [day, month, year] = date.split('.')
      return `${year}-${month}-${day}`
    }
  },
}
</script>

<style>

</style>