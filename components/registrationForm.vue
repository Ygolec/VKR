<template>
  <v-dialog
      v-model="registrationDialog"
      persistent
      width="1024">
    <template v-slot:activator="{ props }">
      <v-btn
          color="primary"
          class="flex-grow-1"
          v-bind="props"
      >
        Регистрация
      </v-btn>
    </template>
    <v-card>
      <v-form
          ref="registrationForm"

      >
      <v-card-title>
        Регистрация
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col
                cols="12"
                sm="6"
                md="4">
              <v-text-field
                  label="Имя"
                  hint="Эта информация будет использоваться для написания благодарственных писем"
                  v-model="student.name"
                  :rules="[required]"
                  required
              >
              </v-text-field>
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="4">
              <v-text-field
                  label="Фамилия"
                  v-model="student.surName"
                  hint="Эта информация будет использоваться для написания благодарственных писем"
                  :rules="[required]"
                  required
              >
              </v-text-field>
            </v-col>
            <v-col
                cols="12"
                sm="6"
                md="4">
              <v-text-field
                  label="Отчество"
                  v-model="student.middleName"
                  hint="Эта информация будет использоваться для написания благодарственных писем"
                  :rules="[required]"
                  required
              >
              </v-text-field>
            </v-col>
            <v-col
                cols="12"
                sm="5"
                md="5">
              <v-autocomplete
                  label="Институт"
                  v-model="student.insitution"
                  :items="institutions"
                  :rules="[required]"
                  required
              >
              </v-autocomplete>
            </v-col>
            <v-col
                cols="12"
                sm="5"
                md="5">
              <v-autocomplete
                  label="Группа"
                  v-model="student.group"
                  :rules="[required]"
                  :items="group"
                  required
                  @update:search="getGroup()"
              >
              </v-autocomplete>
            </v-col>
            <v-col
                cols="12"
                sm="2"
                md="2">
              <v-label class="genderLabel text-subtitle-2">Пол</v-label>
              <v-btn-toggle
                  class="genderInput"
                  variant="outlined"
                  v-model="student.gender">
                <v-btn value="man">М</v-btn>
                <v-btn value="woman">Ж</v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  label="Номер телефона"
                  hint="Эта информация будет использоваться для связи с вами"
                  prefix="8"
                  placeholder="8005553535"
                  :rules="[telephone,required]"
                  v-model="student.telNumber"
                  counter
                  maxlength="10"
                  type="tel"
                  required
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  label="Дата рождения"
                  hint="Эта информация будет использоваться для выбора мероприятий"
                  :model-value="student.birthday.getFullYear() + '-' + (student.birthday.getMonth()+1).toString().padStart(2,'0') + '-' + student.birthday.getDate().toString().padStart(2,'0')"
                  :rules="[birthday]"
                  type="date"
                  required
                  @update:modelValue="value=>student.birthday=new Date(value)"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  label="Email"
                  hint="Эта информация будет использоваться для восстановления пароля и подверждения данных"
                  type="email"
                  v-model="student.email"
                  :rules="[email,required]"
                  placeholder="test@gmail.com"
                  required
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  label="Пароль"
                  v-model="student.password"
                  :rules="[password,required]"
                  counter
                  maxlength="20"
                  type="password"
                  required
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  label="Повторите пароль"
                  v-model="secondPassword"
                  type="password"
                  counter
                  maxlength="20"
                  :rules="[checkSecondPassword(student.password)]"
                  required
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            @click="registrationDialog=false"
            variant="outlined"
            color="error">
          Отменить регистрацию
        </v-btn>
        <v-btn
            color="success"
            variant="outlined"
            @click="validate">
          Зарегистрироваться
        </v-btn>
      </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {birthday, checkSecondPassword, email, password, required, telephone} from "~/utils/rules";
import {StudentRegistration} from "~/server/api/auth/register.post";
const valid=ref(true)
const registrationDialog = ref()
const registrationForm=ref()
const student:StudentRegistration = reactive({
  name: "",
  surName: "",
  middleName: "",
  insitution: "",
  group: "",
  telNumber: "",
  birthday: new Date(),
  email: "",
  password: "",
  gender:"man"
})
const secondPassword=ref()
const institutions = ref(['ИИТК', 'ИКТ'])
const group = ref(['БИС19-01'])
if (student.password==secondPassword.value){

}
async function validate() {

  const {valid} = await registrationForm.value.validate()
  if (student.password==secondPassword.value){

  }
 if (valid) {
   await $fetch('/api/auth/register',
       {
         method: 'post',
         body:student
       }).then(
       registrationDialog.value=false
   )
 }
}
async function getGroup() {
  await $fetch('https://timetable.pallada.sibsau.ru/ajax/search_schedule', {
    method: "post",
   body:{
     id: 717228144,
     jsonrpc: "2.0",
     method: "call",
      params:{query:'БИС'}}
  });
}
</script>

<style scoped lang="scss">
.genderInput{
  margin-top: -15px;
}
.genderLabel{
  position: relative;
  top: -15px;
}
</style>