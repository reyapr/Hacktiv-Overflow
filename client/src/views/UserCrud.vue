<template>
  <div class="home">

  <NavHome/>
  <User/>

  </div>
</template>

<script>
// @ is an alias to /src
import NavHome from '@/components/NavHome'
import User from '@/components/User'

export default {
  name: 'home',
  components: {
    NavHome,
    User,
  },
  mounted(){
    if(!localStorage.getItem('token')){
      this.$router.push({name:'home'})
    }
  }
}
</script>
