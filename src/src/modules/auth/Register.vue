<template>
  <div class="shell-register-form-wrapper">
     <div class="shell-toolbar-register-div">
       <object type="image/svg+xml" data="./static_assets/img/easyWebIcon.svg">
         AGENCY PORTAL
       </object>
     </div>
     <div class="ap--rg-form-stepper-wrapper">
        <v-stepper v-model="formStep" vertical>
            <div class="ap--mod-form-header mt-5">
                Register with Agency Portal
            </div>
            <v-stepper-step step="1" v-bind:complete="formStep > 1">
                Validate email
                <small>Please provide email address to register as a potential recruitment supplier <span v-if=" '' !== companyName">for {{companyName}} </span> or to login if already registered</small>
            </v-stepper-step>
            <v-stepper-content step="1">
                <form name="duplicateApplicantCheckForm" v-on:submit.prevent="checkAgencyExist()">
                    <v-card class="ap--flat-card ma-1">
                        <v-row>
                            <v-col xs12>
                                <v-text-field
                                    type="email"
                                    required
                                    label="Email address"
                                    v-model="agency.email"
                                    prepend-icon="email"
                                    class="input-group--focused"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-btn tag="button" type="submit" primary>Continue</v-btn>
                </form>
            </v-stepper-content>
            <v-stepper-step step="2" v-bind:complete="formStep > 2">Register
            <small>*indicates required field</small>
            </v-stepper-step>
            <v-stepper-content step="2">
                <form name="agencyForm" v-on:submit.prevent="registerMe()">
                    <v-card class="ap--flat-card ap--rg-form-card ma-1">
                    <v-row>
                        <v-col xs12>
                            <blockquote class="ap--rg-quote">
                                <b>Please note: </b>Completion of this form will add your details to the clients ATS as an unapproved supplier. It does not mean you are approved to work on any live vacancies. When our client reviews their PSL or if they have a specific need
                                for more agency assistance they try and consider agencies who have registered but are not yet unapproved suppliers.
                            </blockquote>
                        </v-col>
                    </v-row>
                    <v-row class="mt-2">
                        <v-col xs12>
                            <blockquote class="ap--rg-quote">
                                Please do not follow up completion of this form with emails or calls to our client. This online process has been designed to organise the process of evaluating new suppliers. With the aim of reducing the number of sales calls and emails to our client.
                            </blockquote>
                        </v-col>
                    </v-row>
                    <v-divider />
                    <v-row>
                        <v-col xs12>
                        <v-subheader>
                            Your details:
                        </v-subheader>
                        </v-col>
                    </v-row>
                        <v-row>
                            <v-col xs6>
                                <v-text-field
                                    type="text"
                                    required
                                    label="First name"
                                    v-model="agency.first_name"
                                    class="input-group--focused"
                                ></v-text-field>
                            </v-col>
                            <v-col xs6>
                                <v-text-field
                                    type="text"
                                    required
                                    label="Last name"
                                    v-model="agency.last_name"
                                    class="input-group--focused"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                        <v-col xs6>
                            <v-text-field
                                    type="email"
                                    required
                                    label="Email address"
                                    v-model="agency.email"
                                    class="input-group--focused"
                                ></v-text-field>
                        </v-col>
                        <v-col xs6>
                            <v-text-field
                                    type="text"
                                    required
                                    label="Office contact numer"
                                    v-model="agency.telephone"
                                    class="input-group--focused"
                                ></v-text-field>
                        </v-col>
                        </v-row>
                        <v-row>
                        <v-col xs6>
                            <v-text-field
                                    type="text"
                                    label="Mobile contact number"
                                    v-model="agency.mobile"
                                    class="input-group--focused"
                                ></v-text-field>
                        </v-col>
                        </v-row>
                        <v-divider />
                    <v-row>
                        <v-col xs12>
                        <v-subheader>
                            Organization details:
                        </v-subheader>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col xs6>
                            <v-text-field
                                type="text"
                                required
                                label="Agency name"
                                v-model="agency.organisation_name"
                                class="input-group--focused"
                            ></v-text-field>
                        </v-col>
                        <v-col xs6>
                            <v-text-field
                                type="text"
                                required
                                label="Agency website address"
                                class="input-group--focused"
                                v-model="agency.website"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                        <v-row>
                        <v-col xs6>
                            <v-text-field
                                type="text"
                                required
                                label="Registered company number"
                                v-model="agency.registered_no"
                                class="input-group--focused"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-divider />
                    <v-row>
                        <v-col xs12>
                        <v-subheader>
                            Commercial details:
                        </v-subheader>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col xs6>
                            <v-text-field
                                prepend-icon="attach_file"
                                single-line
                                v-model="terms_of_business"
                                label="Terms of business"
                                required
                                @click.native="onFocus('terms_of_business')" ref="fileTextField"></v-text-field>
                            <input type="file" ref="terms_of_business" @change="uploadFile('terms_of_business')">
                        </v-col>
                        <v-col xs6>
                            <v-text-field
                                prepend-icon="attach_file"
                                single-line
                                v-model="brochure"
                                label="Company brochure"
                                required
                                @click.native="onFocus('brochure')" ref="fileTextField"></v-text-field>
                            <input type="file" ref="brochure" @change="uploadFile('brochure')">
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col xs6>
                        <v-text-field
                                type="text"
                                required
                                hint="Please try and be specific rather than add notes such as TBC."
                                label="Please detail the likely margin/rates you would work to"
                                persistent-hint	
                                v-model="agency.margin_rates"
                                class="input-group--focused"
                            ></v-text-field>
                        </v-col>
                        <v-col xs6>
                            <v-text-field
                            type="text"
                            label="Payment terms (days)"
                            class="input-group--focused"
                            v-model="agency.payment_terms">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col xs12>
                            <v-text-field
                                    type="text"
                                    hint="Use this section to detail anything else you want to include to support your application."
                                    label="Notes"
                                    persistent-hint	
                                    multi-line
                                    class="input-group--focused"
                                    v-model="agency.notes"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    </v-card>
                    <router-link class="btn btn--flat btn--light btn--raised" :to="{ name: 'Login'}">Cancel</router-link>
                    <v-btn tag="button" type="submit" primary>Register</v-btn>
                </form>
            </v-stepper-content>
            <v-stepper-step step="3" v-bind:complete="formStep > 2">
                Login
            </v-stepper-step>
            <v-stepper-content step="3">
                    <v-card class="ap--flat-card mb-5">
                        <v-row>
                            <v-col xs12>
                                <v-alert success v-bind:value="true">
                                    <div v-html="successMessage">
                                    </div>
                                </v-alert>
                            </v-col>
                        </v-row>
                    </v-card>
                <router-link :to="{ name: 'Login'}">Login</router-link>
            </v-stepper-content>
        </v-stepper>
     </div>
    <v-snackbar 
        top
        right
        v-model="showMessage" >
        {{message}}
        <v-btn flat class="pink--text" @click.native="showMessage = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script src="./register.js"></script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ap--rg-form-stepper-wrapper {
    margin-top: 5rem;
    width: 95%;
    margin: auto;
}

.ap--rg-quote {
    font-size: 1.2rem;
    text-align: left;
}

.card.ap--rg-form-card > hr {
    margin: 1rem 0;
}

.card.ap--rg-form-card > .row > .col > .subheader {
    padding: 0;
}

input[type=file] {
    position: absolute;
    left: -99999px;
}
</style>
