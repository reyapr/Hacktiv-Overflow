<template>
    <div id='question'>
        <NavHome/>
        <b-container class="bv-example-row text-left mt-5" >
        <h2 style='text-align:center'>Question</h2>
        <div >
            <b-row align-h='center' >
                <b-col sm="2" class='mt-2 pt-2' style="text-align:center;" >
                    <b-button @click='plusVote(question._id)'> Up </b-button> 
                    <br>
                    <br> 
                    <p>{{vote}}</p> 
                    <b-button @click='minVote(question._id)'>Down</b-button>
                </b-col>
                <b-col sm="8" class='mt-3' >
                    <h5>{{question.title}}</h5>
                    <p style="font-size:13px"> Post by {{question.user.name}}, {{getDate(question.createdAt)}}</p>
                    <p v-html='question.content'> </p>
                    <b-badge variant="info">Tags</b-badge>
                </b-col>
            </b-row>
            <hr>
        </div>
    </b-container>

    <!-- answer -->
    <h2 style='text-align:center;'>Answers</h2>
    <b-container class="bv-example-row text-left mt-5" v-for="(answer, index) in  question.answers" :key='index'>
        <div >
            <b-row align-h='center' >
                <b-col sm="2" class='mt-2 pt-2' style="text-align:center;" >
                   <b-button> Up </b-button> 
                   <br>
                   <br>
                    <p>0</p>
                    <b-button>Down</b-button>
                </b-col>
                <b-col sm="8" class='mt-3'  >
                    <p style="font-size:13px"> Post by {{question.user.name}}, {{getDate(question.createdAt)}}</p>
                    <p v-html='answer.content' style="font-size:15px"> </p>
                    <b-badge variant="info">Tags</b-badge>
                </b-col>
            </b-row>
            <div v-if="user==question.user._id">
                <b-button variant='danger' style="float:right" @click='deleteAnswer(answer._id)' >Delete</b-button>
                <b-button  variant='info' style="float:right" @click='editAnswer(answer.content,answer._id,index)'>Edit</b-button>
            </div>
            
            <hr>
        </div>
    </b-container>
    <div class='col-sm-8 mx-auto'>
            <div class="form-group" >
                <label for="usr" id='edt'>Answer:</label>
                <input type="text" class="form-control" id="usr" v-model='title' ref='edt' >
            </div>
        <tinymce id="d1" v-model="answer"  ></tinymce>
         <div class="modal-footer"  >
            <button v-if='edit==false' type="button" class="btn btn-info" data-dismiss="modal" @click='addAnswer' >Submit</button>
            <button v-if='edit==true' type="button" class="btn btn-info" data-dismiss="modal" @click='updateAnswer' >Update</button>
        </div>
    </div>
    </div>
</template>


<script>

import NavHome from "@/components/NavHome";
import {mapActions,mapState} from 'vuex'
import tinymce from 'vue-tinymce-editor'
import axios from 'axios'
import swal from 'sweetalert'

    export default {
        name:'question',
        data(){
            return {
                title:'',
                answer:'',
                edit:false,
                id:'',
                index:'',
                up:this.upVote,
                down:this.downVote,
                user:''

            }
        },
        components:{
            NavHome,
            tinymce
        },
        methods:{
            ...mapActions([
                'getQuestion'
            ]),
            plusVote(id,total){
                axios.put(`https://overflow-api.maxville.net/users/question/up-vote/${id}`,{
                },{
                    headers:{
                        token:localStorage.getItem('token')
                    },
                    onUploadProgress: function (progressEvent) {
                            let process = Math.round(100 * (progressEvent.loaded / progressEvent.total))
                            self.process = process
                    },
                })
                .then(response=>{
                    if(self.process==100){
                    self.process = 0
                    }

                    this.up +=1
                    console.log(response)
                })
                .catch(err=>{
                    swal({
                        text : err.response.data.message
                    })
                   
                })
            },
            minVote(id){
                    axios.put(`https://overflow-api.maxville.net/users/question/down-vote/${id}`,{
                },{
                    headers:{
                        token:localStorage.getItem('token')
                    },
                    onUploadProgress: function (progressEvent) {
                            let process = Math.round(100 * (progressEvent.loaded / progressEvent.total))
                            self.process = process
                    },
                })
                .then(response=>{
                    if(self.process==100){
                    self.process = 0
                    }

                    this.down -=1
                })
                .catch(err=>{
                    swal({
                        text : err.response.data.message
                    })
                   
                })
            },
            getDate(d){
                return d.split('T')[0]
            },
            editAnswer(answer,id,index){
                this.$refs.edt.focus()
                this.edit = true
                this.answer = answer
                this.id = id
                this.index = index
                
            },
            updateAnswer(){
                let self = this
                axios.put(`https://overflow-api.maxville.net/users/question/${this.id}`,{
                    title:self.title,
                    content:self.content
                },{
                    headers:{
                        token:localStorage.getItem('token')
                    },
                    onUploadProgress: function (progressEvent) {
                            let process = Math.round(100 * (progressEvent.loaded / progressEvent.total))
                            self.process = process
                    },
                })
                .then(response=>{
                    if(self.process==100){
                    self.process = 0
                    }
                    swal({
                        text:response.data.message
                    })
                    self.question[self.index].title = self.title
                    self.question[self.index].content = self.content
                })
                .catch(err=>{
                    swal({
                        text:err.response.data.message
                    })
                })
            },
            addAnswer(){
                let self = this
                let id = self.$route.params.user
                console.log(self.answer)
                axios.post(`https://overflow-api.maxville.net/users/answer/add/${id}`,{
                    content:self.answer
                },{
                    headers:{
                        token:localStorage.getItem('token')
                    },
                    onUploadProgress: function (progressEvent) {
                        let process = Math.round(100 * (progressEvent.loaded / progressEvent.total))
                        self.process = process
                    },
                }).then(response=>{
                    if(self.process==100){
                        self.process = 0
                    }
                    this.question.answers.push(response)
                    swal({
                        text: 'success to add answer'
                    })
                  
                }).catch(err=>{
                    swal({
                        text:err.response
                    })
                })
            },
            deleteAnswer(id,position){
                 axios.delete(`https://overflow-api.maxville.net/users/answer/${id}`,{
                    headers:{
                        token:localStorage.getItem('token')
                    }
                })
                .then(response=>{
                    swal({
                        text:response.data.message
                    })
                    this.question.answers.splice(position,1)
                }).catch(err=>{
                    console.log(err)
                })
            },
            total(){
                let up = this.question.upVote.length
                let down =this.question.downVote.length
                return up-down
            }
            
        },
        computed:{
            ...mapState([
                'question',
                'upVote',
                'downVote'
            ]),
            vote(){
                return this.upVote - this.downVote
            }
        },
        created(){
            this.getQuestion(this.$route.params.user)
            this.user = localStorage.getItem('id')
        }
    }

</script>