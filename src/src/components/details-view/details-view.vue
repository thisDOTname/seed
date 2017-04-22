<template>
  <v-container fluid="fluid" class="text-xs-left pl-1">
    <v-card :class="{'ap--flat-card': 'true' === flatcard}">
      <v-card-text>
        <v-row>
          <v-col xs6 v-for="field in dataset" :key="field.name" v-if="field.type !== 'description' && field.type !== 'filesArray' && field.label">
            <v-row class="ma-3">
              <v-col xs6 v-text="getPlainText(field.label)" class="ap-jd-field-label">
              </v-col>
              <v-col v-if="field.type !== 'choice' && field.type !== 'file'" xs6 v-html="field.value" class="grey--text">
              </v-col>
              <v-col xs6 v-else-if="field.type === 'choice' && field.value" class="grey--text" v-html="getChoiceLabel(field)">
              </v-col>
              <v-col v-else-if="field.type === 'file' && field.value" xs6>
                <a href="javascript:void(0)" title="Download" @click="downloadFile({'id':field.value})">
                  <v-icon class="grey--text">file_download</v-icon>
                </a>
              </v-col>
            </v-row>
            <v-divider />
          </v-col>
          <v-col xs12 v-else-if="field.type === 'description'" v-for="description in field.value" :key="description.title">
            <v-row class="ma-3 ap-jd-field-label">
              <v-col xs12 v-html="description.title">
              </v-col>
            </v-row>
            <v-divider />
            <v-row class="mt-1 ml-3 grey--text">
              <v-col xs12 v-html="description.description">
              </v-col>
            </v-row>
          </v-col>
          <v-col xs12 v-else-if="field.type === 'filesArray'">
            <v-row class="ma-3">
              <v-col xs12 class="ap-jd-field-label">
                Files
              </v-col>
            </v-row>
            <v-divider />
            <v-row class="ma-3" v-for="file in field.value" :key="file.id">
              <v-col xs4>
                <div v-html="file.title" class="ap-jd-field-label">
                </div>
              </v-col>
              <v-col xs2>
                <a href="javascript:void(0)" title="preview" v-bind:disabled="file.status != 'completed'" @click="filePreview(file)">
                  <v-icon>visibility</v-icon>
                </a>
              </v-col>
              <v-col xs2>
                <a href="javascript:void(0)" title="Download" v-bind:disabled="file.status != 'completed'" @click="downloadFile(file)">
                  <v-icon>file_download</v-icon>
                </a>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-modal v-show="showPreview" v-model="showPreview">
      <v-card>
        <v-card-text class="subheading grey--text">
          <div id="previewTitle" class="file-title">
          </div>
          <iframe id="previewBody" v-bind:src="previewUrl">
          </iframe>
        </v-card-text>
        <v-card-row actions>
          <v-spacer></v-spacer>
          <v-btn flat v-on:click.native="showPreview = false" class="primary--text">Close</v-btn>
        </v-card-row>
      </v-card>
    </v-modal>
    <v-snackbar 
        :timeout="notify.timeout"
        :top="notify.top"
        :bottom="notify.bottomm"
        :right="notify.right"
        :left="notify.left"
        v-model="showNotification"
    >
        {{notificationMessage}}
        <v-btn flat class="pink--text" @click.native="showNotification = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script src="./details-view.js">
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#previewBody {
  height: calc(100%)
}
.ap-jd-field-label {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(0,0,0,0.54);
}
</style>
