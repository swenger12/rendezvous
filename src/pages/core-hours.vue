<template>
    <div>
        <h4 class="display-1">Set Core Hours</h4>

        <instructions details="Put in the start times and stop times to show your availability" />

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
                    v-model="startdatetime"
                    error-count="10"
                    label="Monday Start Time"
            >
            </v-text-field>
            <v-text-field
                    v-model="enddatetime"
                    error-count="10"
                    label="Monday End Time"
                    required
            >
            </v-text-field>
            <v-text-field
                    v-model="tuesdayStartTime"
                    error-count="10"
                    label="Tuesday Start Time"
            >
            </v-text-field>
            <v-text-field
                    v-model="tuesdayEndTime"
                    error-count="10"
                    label="Tuesday End Time"
                    required
            >
            </v-text-field>
            <v-text-field
                    v-model="wednesdayStartTime"
                    error-count="10"
                    label="Wednesday Start Time"
            >
            </v-text-field>
            <v-text-field
                    v-model="wednesdayEndTime"
                    error-count="10"
                    label="Wednesday End Time"
                    required
            >
            </v-text-field>
            <v-text-field
                    v-model="thursdayStartTime"
                    error-count="10"
                    label="Thursday Start Time"
                    required
            >
            </v-text-field>
            <v-text-field
                    v-model="thursdayEndTime"
                    error-count="10"
                    label="Thursday End Time"
                    required
            >
            </v-text-field>
            <v-text-field
                    v-model="fridayStartTime"
                    error-count="10"
                    label="Friday Start Time"
            >
            </v-text-field>
            <v-text-field
                    v-model="fridayEndTime"
                    error-count="10"
                    label="Friday End Time"
                    required
            >
            </v-text-field>
            <v-text-field
                    v-model="saturdayStartTime"
                    error-count="10"
                    label="Saturday Start Time"
            >
            </v-text-field>
            <v-text-field
                    v-model="saturdayEndTime"
                    error-count="10"
                    label="Saturday End Time"
                    required
            >
            </v-text-field>
            <v-text-field
                    v-model="sundayStartTime"
                    error-count="10"
                    label="Sunday Start Time"
            >
            </v-text-field>
            <v-text-field
                    v-model="sundayEndTime"
                    error-count="10"
                    label="Sunday End Time"
                    required
            >
            </v-text-field>
            <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
            >Set Core Hours
            </v-btn>

            <v-btn v-bind:disabled="!valid" v-on:click="handleMonday"
            >Monday
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
        name: "CoreHoursPage",
        components:{
            Instructions
        },
        data: function () {
            return{
                valid: false,
                email: "",
                startdatetime: "",
                enddatetime: "",
                tuesdayStartTime: "",
                tuesdayEndTime: "",
                wednesdayStartTime: "",
                wednesdayEndTime: "",
                thursdayStartTime: "",
                thursdayEndTime: "",
                fridayStartTime: "",
                fridayEndTime: "",
                saturdayStartTime: "",
                saturdayEndTime: "",
                sundayStartTime: "",
                sundayEndTime: "",

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
            handleSubmit: function () {
                axios
                    .post("api/corehours", {
                        email: this.email,
                        startdatetime: this.startdatetime,
                        enddatetime: this.enddatetime,
                        tuesdayStartTime: this.tuesdayStartTime,
                        tuesdayEndTime: this.thursdayEndTime,
                        wednesdayStartTime: this.wednesdayStartTime,
                        wednesdayEndTime: this.wednesdayEndTime,
                        thursdayStartTime: this.thursdayStartTime,
                        thursdayEndTime: this.thursdayEndTime,
                        fridayStartTime: this.fridayStartTime,
                        fridayEndTime: this.fridayEndTime,
                        saturdayStartTime: this.saturdayStartTime,
                        saturdayEndTime: this.saturdayEndTime,
                        sundayStartTime: this.sundayStartTime,
                        sundayEndTime: this.sundayEndTime,
                    })
                    .then(result => {
                        if (result.status === 200) {
                            if (result.data.ok) {
                                this.showDialog("Success", result.data.msge);
                            } else {
                                this.showDialog("Sorry", result.data.msge);
                            }
                        }
                    })
                    .catch(err => this.showDialog("Failed", err));
            },
            handleMonday: function(){
                axios
                    .post("/api/core-hours", {
                        email: this.email,
                        startdatetime: this.startdatetime,
                        enddatetime: this.enddatetime,
                    })
                    .then(result =>{
                        if(result.status === 200){
                            if (result.data.ok) {
                                this.showDialog("Enter in Monday Hours");
                            } else {
                                this.showDialog("Dont enter Monday Hours");
                            }
                        }
                    })
                    .catch(err => this.showDialog("Monday Never Came", err));
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
