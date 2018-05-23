<template>
  <div class="home">
    <NavHome/>
    <b-container class="bv-example-row text-left mt-5" >
        <h2 style='text-align:center'>All Questions</h2>
        <div v-for='(question, index) in questions' :key='index'>
            <b-row align-h='center' >
                <b-col sm="2" class='mt-2 pt-2' style="text-align:center;" >
                    <p class='vote'>Vote</p>
                    <p>{{question.upVote.length-question.downVote.length}}</p>
                    <p class='vote'>Answer</p>
                    <p>{{question.answers.length}}</p>
                </b-col>
                <b-col sm="8" class='mt-3' >
                    <router-link :to="{name:'question',params:{user:question._id}}"> <h5>{{question.title}}</h5></router-link>
                    <p style="font-size:13px"> Post by {{question.user.name}}, {{getDate(question.createdAt)}}</p>
                    <p v-html='question.content'></p>
                    <b-badge variant="info">Tags</b-badge>
                </b-col>
            </b-row>
            <hr>
        </div>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import NavHome from '@/components/NavHome'
import User from '@/components/User'
import {mapActions,mapState} from 'vuex'


export default {
  name: 'home',
  components: {
    NavHome,
    User,
  },
  methods:{
        ...mapActions([
            'getQuestions'
        ]),
        getDate(d){
            return d.split('T')[0]
        }
  },
  computed:{
      ...mapState([
          'questions',
          'upVote',
          'downVote'
      ]),
      vote(){
            return this.upVote - this.downVote
        }
  },
  mounted(){
      this.getQuestions()
  }
}
</script>

<style>
  .vote{
    font-size: 13px;
    text-align: center;
  }
</style>

