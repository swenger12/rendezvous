<template>
    <div>
        <h4 class="display-1">Team Home Page</h4>

        <instructions details="Create, Join, or Remove Team" />

        <v-form v-model="valid">

            <v-text-field
                    v-model="email"
                    v-bind:rules="rules.email"
                    error-count="10"
                    type="email"
                    label="Your email address"
            >
            </v-text-field>

            <v-text-field
                    v-model="day"
                    error-count="10"
                    label="Day"
                    required
            >
            </v-text-field>

            <v-text-field
                    v-model="startdatetime"
                    error-count="10"
                    label="Start Time"
            >
            </v-text-field>

            <v-text-field
                    v-model="enddatetime"
                    error-count="10"
                    label="End Time"
                    required
            >
            </v-text-field>


            <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
            >Submit
            </v-btn>

        </v-form>

        <div class="text-xs-center">
            <v-dialog v-model="dialogVisible" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        {{ dialogHeader }}
                    </v-card-title>

                    <v-card-text> {{ dialogText }} </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat v-on:click="hideDialog"
                        >Okay</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
    import Instructions from "../components/Instructions.vue";
    import axios from "axios";


    export default {
        name: "TeamPage",
        components:{
            Instructions
        },
        data: function () {
            return{
                valid: false,
                email: "",
                day: "",
                startdatetime: "",
                enddatetime: "",

                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,

                rules:{
                    required: [
                        val => val.length > 0 || "Required"
                    ],
                    email: [
                        val => /^\w+@\w+\.\w{2,}$/.test(val) || "Invalid e-mail"
                    ],
                    password: [
                        val => /[A-Z]/.test(val) || "Need upper case letter",
                        val => /[a-z]/.test(val) || "Need lower case letter",
                        val => /\d/.test(val) || "Need digit",
                        val => val.length >= 8 || "Minimum 8 characters"
                    ]
                }
            };
        },
        methods:{
            handleSubmit: function(){
                axios
                    .post("/api/Team", {
                        email: this.email,
                        startdatetime: this.startdatetime,
                        enddatetime: this.enddatetime,
                        day: this.day,
                    })
                    .then(result =>{
                        if(result.status === 200){
                            if (result.data.ok) {
                                this.showDialog("Entered  Hours Successfully",);
                            } else {
                                this.showDialog("Dont enter  Hours");
                            }
                        }
                    })
                    .catch(err => this.showDialog("Hours Never Came", err));
            },

            showDialog: function(header, text) {
                this.dialogHeader = header;
                this.dialogText = text;
                this.dialogVisible = true;
            },
            hideDialog: function() {
                this.dialogVisible = false;
                this.$router.push({ name: "home-page" });
            }
        }
    };

</script>
