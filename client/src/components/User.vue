<template>
    <div class='container col-sm-10 col-sm-offset-1' >
        <div class='profile'  >
            <h2> Welcome </h2>
           
            <div>
                <div class="form-group">
                    <label for="usr">Title:</label>
                    <input type="text" class="form-control" id="usr" v-model='title' ref='edt' >
                </div>

                <label for="comment">Content:</label>
                <editor api-key="ms3c8a5ru7qxsy1zvxbop1xu96j3zxatyld6hyt8p9pfzz4y" :init="{plugins: 'wordcount'}" v-model='content'></editor>
                 <div class="modal-footer">
                    <button v-if='edit==false' type="button" class="btn btn-info" data-dismiss="modal" @click='addQuestion' >Submit</button>
                    <button v-if='edit==true' type="button" class="btn btn-info" data-dismiss="modal" @click='updateQuestion' >Update</button>
                </div>
            </div>                
            <!-- Modal Component -->
              <div class="col-12">
            <div class="progress">
                <div 
                class="progress-bar" 
                role="progressbar" 
                :style="'width: '+process+'%;'" 
                :aria-valuenow="process" 
                aria-valuemin="0" 
                aria-valuemax="100"
                >{{process}}%</div>
            
            </div>
        </div>   
        <!-- end process -->
        <div >
            <table class="table col-sm-2 " >
                <thead>
                    <tr > 
                        <th> No.</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Created At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody style='text-align:left'>
                    <tr v-for='(question, index) in questions' :key='index'>
                        <td>{{index+1}}</td>
                        <td> {{question.title}} </td>
                        <td> {{question.content}} </td>
                        <td> {{question.createdAt}} </td>
                        <td >
                            <button  type="button" class="btn btn-warning" @click="editQuestion(question._id,question.title,question.content,index)" >Edit</button >
                            <button @click='deleteQuestion(question._id,index)' type="button" class="btn btn-danger ">Delete</button >
                        </td>
                    </tr>
                   
                </tbody>
            </table>
        </div>
                
        </div>

        <!-- process bar -->
       

    </div>
</template>

<script>
    import axios from 'axios'
    import swal from 'sweetalert'
    import {mapActions, mapState} from 'vuex'
    import Editor from '@tinymce/tinymce-vue'

    export default {
        data(){
            return {
                process:null,
                title:'',
                content:'',
                edit:false,
                id:'',
                index:''
            }
        },
        components:{
           'editor': Editor
        },
        methods:{
            ...mapActions([
                'searchVal',
                'getUserQuestions'
            ]),
            addQuestion(){
                let self = this
                axios.post('https://overflow-api.maxville.net/users/question/add',{
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
                }).then(response=>{
                    if(self.process==100){
                        self.process = 0
                    }
                    this.questions.push(response.data.result)
                    swal({
                        text: response.data.message
                    })
                  
                }).catch(err=>{
                    swal({
                        text:err.response.data.message
                    })
                })
            },
            editQuestion(id,title,content,index){
                this.$refs.edt.focus()
                this.edit = true
                this.title = title
                this.content = content
                this.id = id
                this.index = index
               
            },
            updateQuestion(){
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
                    self.questions[self.index].title = self.title
                    self.questions[self.index].content = self.content
                })
                .catch(err=>{
                    swal({
                        text:err.response.data.message
                    })
                })
            },
            deleteQuestion(id,position){
                axios.delete(`https://overflow-api.maxville.net/users/question/${id}`,{
                    headers:{
                        token:localStorage.getItem('token')
                    }
                })
                .then(response=>{
                    swal({
                        text:response.data.message
                    })
                    this.questions.splice(position,1)
                }).catch(err=>{
                    console.log(err)
                })
            },
        },
        computed: {
             ...mapState([
                'search',
                'userQuestion'
            ]),
            questions(){
                return this.userQuestion
            },
        },
        mounted(){
         
            this.getUserQuestions()
            console.log(this.userQuestion)
        }
    }
</script>

<style scoped>

    .profile {
        height: 100px;
        margin:15px 0;
    }

</style>