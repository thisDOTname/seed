<template>
  <div>
    <div class="ap--fp-wrapper">
        <v-card horizontal class="ap--fp-horizontal-card">
          <v-card-row class="ap--lg-logo">
            <div class='box'>
              <div class='wave -one'></div>
              <div class='wave -two'></div>
              <div class='wave -three'></div>
              <div class='title'>
                <object type="image/svg+xml" data="./static_assets/img/easyWebIcon.svg">
                  AGENCY PORTAL
                </object>
              </div>
            </div>
          </v-card-row>
          <v-card-column>
            <v-card-row>
              <v-spacer></v-spacer>
              <v-card-text class="text-xs-center">
                <div class="ap--fp-card-text" v-if="showForm">
                  Let’s find your account
                </div>
                <form v-if="showForm" name="forgotPasswordForm" class="ap--fp-forgotpassword-form" v-on:submit.prevent="submit()">
                  <v-row>
                    <v-col xs12>
                      <div>
                      <v-text-field
                        name="emailField"
                        label="Email"
                        value=""
                        required
                        type="email"
                        v-model="user.username"
                      ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col xs12>
                        <div>
                          <v-btn tag="button" type="submit" outline round primary>
                            Submit
                          </v-btn>
                        </div>
                    </v-col>
                  </v-row>
                </form>
                <v-row v-else>
                  <v-col xs12>
                    <v-alert success v-bind:value="true">
                      {{successMessage}}
                    </v-alert>
                  </v-col>
                  <v-col xs12>
                    <router-link :to="{name: 'Login'}">
                      <v-btn primary>
                      Login
                      </v-btn>
                    </router-link>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card-row>
          </v-card-column>
      </v-card>
    </div>
    <v-snackbar 
      :timeout="notify.timeout"
      :top="notify.top"
      :bottom="notify.bottomm"
      :right="notify.right"
      :left="notify.left"
      v-model="showNotification">
        {{notificationMessage}}
      <v-btn flat class="pink--text" @click.native="showNotification = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script src="./forgotpassword.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.ap--fp-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 60%;
    height: 40%;
    -webkit-perspective: 1000px; /* Chrome, Safari, Opera */
    perspective: 1000px;
    -webkit-backface-visibility: hidden; /* Chrome, Safari, Opera */
    backface-visibility: hidden;
}

.card__row.ap--lg-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25rem !important;
    background-color: #5f6062;
    -webkit-perspective: 1000px; /* Chrome, Safari, Opera */
    perspective: 1000px;
    -webkit-backface-visibility: hidden; /* Chrome, Safari, Opera */
    backface-visibility: hidden;
}



html, body {
  height: 100%;
  -webkit-perspective: 1000px; /* Chrome, Safari, Opera */
  perspective: 1000px;
  -webkit-backface-visibility: hidden; /* Chrome, Safari, Opera */
  backface-visibility: hidden;
}

html {
  background: #eee;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  width: 100%;
  height: inherit;
  background: lighten(#ffffff, 10%);
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  -webkit-perspective: 1000px; /* Chrome, Safari, Opera */
  perspective: 1000px;
  -webkit-backface-visibility: hidden; /* Chrome, Safari, Opera */
  backface-visibility: hidden;
}

.wave {
  opacity: .4;
  position: absolute;
  top: 3%;
  left: 50%;
  background: #0099ff;
  width: 500px;
  height: 500px;
  margin-left: -250px;
  margin-top: -250px;
  transform-origin: 50% 48%;
  border-radius: 43%;
  animation: drift 5000ms infinite linear;
  -webkit-perspective: 1000px; /* Chrome, Safari, Opera */
  perspective: 1000px;
  -webkit-backface-visibility: hidden; /* Chrome, Safari, Opera */
  backface-visibility: hidden;
}

.wave.-three {
  animation: drift 7000ms infinite linear;
  -webkit-perspective: 1000px; /* Chrome, Safari, Opera */
  perspective: 1000px;
  -webkit-backface-visibility: hidden; /* Chrome, Safari, Opera */
  backface-visibility: hidden;
}

.wave.-two {
  animation: drift 9000ms infinite linear;
  opacity: .1;
  background: #ffb300;
  -webkit-perspective: 1000px; /* Chrome, Safari, Opera */
  perspective: 1000px;
  -webkit-backface-visibility: hidden; /* Chrome, Safari, Opera */
  backface-visibility: hidden;
}

.box:after {
  content: '';
  display: block;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(#1d353f, 1), rgba(#def, 0) 80%, rgba(white, .5));
  z-index: 11;
  transform: translate3d(0, 0, 0);
  -webkit-perspective: 1000px; /* Chrome, Safari, Opera */
  perspective: 1000px;
  -webkit-backface-visibility: hidden; /* Chrome, Safari, Opera */
  backface-visibility: hidden;
}

.title {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  line-height: 300px;
  text-align: center;
  transform: translate3d(0, 0, 0);
  color: white;
  text-transform: uppercase;
  font-family: 'Playfair Display', serif;
  letter-spacing: .4em;
  font-size: 24px;
  text-shadow: 0 1px 0 rgba(black, .1);
  text-indent: .3em;
  -webkit-perspective: 1000px; /* Chrome, Safari, Opera */
  perspective: 1000px;
  -webkit-backface-visibility: hidden; /* Chrome, Safari, Opera */
  backface-visibility: hidden;
}
@keyframes drift {
  from { transform: rotate(0deg); }
  from { transform: rotate(360deg); }
}

.card--horizontal.ap--fp-horizontal-card>.card__row {
  flex: 0 1 50%;
}

.ap--fp-card-text {
    font-size: 1.5rem;
    font-weight: 500;
    padding: 1rem 0;
}

.ap--fp-forgotpassword-form {
  padding: 0 2rem;
}

</style>
