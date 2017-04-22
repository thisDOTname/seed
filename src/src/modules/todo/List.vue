<template>
  <div>
      <h2>Welcome back, {{user.name}} </h2>
    <page-layout :dataset="toDos" :columns="columns">
    </page-layout>
  </div>
</template>

<script src="./list.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
