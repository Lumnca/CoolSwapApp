<template>
  <div class="hello">
      <icon type="waiting-circle"></icon>
  </div>
</template>

<script>
import {Icon  } from 'vux'
export default {
  name: 'HelloWorld',
    components: {
    Icon
  },
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
