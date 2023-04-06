<template>
  <div class="container">
    <div>
      <apexchart
        width="500"
        type="bar"
        :options="chartOptions"
        :series="groupByYearAndMonth(project.expenses)"
      ></apexchart>
    </div>
  </div>
</template>


<script>
import moment from "moment";
export default {
  name: "Graph",
  props: ["project"],
  data() {
    return {
      chartOptions: {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        },
      },
    };
  },
  methods: {
    groupByYearAndMonth(expenses) {
      let sortedExpenses = [
        {
          name: "series-1",
          data: Array(12).fill(0),
        },
      ];
      expenses.forEach((expense) => {
        let month = moment(expense.moment, "DD MM YYYY").month();
        sortedExpenses[0].data[month] += expense.amount;
      });
      return sortedExpenses;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
}
</style>