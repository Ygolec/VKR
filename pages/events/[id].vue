<template>
    <v-app id="inspire">
        <v-main class="bg-grey-lighten-3">
            <v-container>
                <v-row>
                    <v-col cols="2"/>
                    <v-col cols="2">
                        <v-sheet rounded="lg">
                            <v-img
                                    class="align-end text-white"
                                    :src="'/'+itemOfEvent.mainImagePath"
                                    height="400"
                                    cover></v-img>
                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-card>
                            <v-sheet
                                    rounded="lg"
                            >
                                <v-card-title>{{ itemOfEvent.nameEvent }}</v-card-title>
                                <v-card-subtitle>
                                    <div>Дата: {{
                                        itemOfEvent.date.map(item => {
                                          return new Date(item).toLocaleDateString('ru')
                                        }).join(', ')
                                        }}
                                    </div>
                                    <div>Адрес: {{ itemOfEvent.addressEvent.join(', ') }}</div>
                                    <div>Организаторы: {{
                                        itemOfEvent.organizations.map(item => {
                                          return item.name
                                        }).join(', ')
                                        }}
                                    </div>

                                </v-card-subtitle>
                                <v-card-text>
                                            {{ itemOfEvent.descriptionEvent }}
                                </v-card-text>
                                <!--  -->
                            </v-sheet>
                        </v-card>
                    </v-col>
                    <v-col cols="2"/>
                </v-row>
            </v-container>

            <v-container>
                <v-row>
                    <v-col cols="2"/>

                    <v-col cols="2">
                        <v-sheet rounded="lg">

                            <v-list rounded="lg">
                                <v-item-group v-model="list">
                                    <v-item v-slot="{ toggle}"
                                            v-for="item in itemsOfFnds"
                                            :value="item.value">
                                        <v-list-item
                                                :value="item.value"
                                                @click="toggle"
                                        >
                                            <v-list-item-title v-text="item.title"></v-list-item-title>
                                        </v-list-item>
                                    </v-item>
                                </v-item-group>
                            </v-list>

                        </v-sheet>
                    </v-col>

                    <v-col>
                        <v-sheet

                                rounded="lg"
                        >
                            <v-card v-if="list!=undefined">
                                <v-card-title>{{ itemOfEvent.fnds.find(item => item.id === list).nameFND }}
                                </v-card-title>
                                <v-card-subtitle>Адрес
                                    ФНД:{{ itemOfEvent.fnds.find(item => item.id === list).addresses.join(', ') }}
                                </v-card-subtitle>
                                <v-card-text>

                                    <div>Колличество волонтеров:
                                        {{ itemOfEvent.fnds.find(item => item.id === list).quantityVolunteerFND }}
                                    </div>
                                    <div>Даты работы ФНД: {{
                                        itemOfEvent.fnds.find(item => item.id === list).dateFND.map(item => {
                                          return new Date(item).toLocaleDateString('ru')
                                        }).join(', ')
                                        }}
                                    </div>
                                    <div>Время работы ФНД: {{
                                        itemOfEvent.fnds.find(item => item.id === list).times.map(item => {
                                          let start = new Date(item.start);
                                          let end = new Date(item.end);
                                          let time = `${start.getHours()}:${(start.getMinutes() < 10 ? '0' : '') + start.getMinutes()}-${end.getHours()}:${(end.getMinutes() < 10 ? '0' : '') + end.getMinutes()}`;
                                          return time
                                        }).join(', ')
                                        }}
                                    </div>
                                </v-card-text>
                                <v-card-text>Описание ФНД:
                                    {{ itemOfEvent.fnds.find(item => item.id === list).descriptionFND }}
                                </v-card-text>
                                <v-card-actions>
                                    <div v-if="applicationForEvent.find(item=>item.fndId === itemOfEvent.fnds.find(item=>item.id===list).id )">
                                        <v-btn
                                                v-if="applicationForEvent.find(item=>item.fndId === itemOfEvent.fnds.find(item=>item.id===list).id ).status!='SEND'"
                                                @click="sendApplication(itemOfEvent.fnds.find(item=>item.id===list).id,itemOfEvent.id)">
                                            Подать заявку на участие
                                        </v-btn>
                                        <v-btn
                                                @click="undoSendApplication(itemOfEvent.fnds.find(item=>item.id===list).id,itemOfEvent.id)"
                                                v-if="applicationForEvent.find(item=>item.fndId === itemOfEvent.fnds.find(item=>item.id===list).id ).status==='SEND' && applicationForEvent.find(item=>item.fndId === itemOfEvent.fnds.find(item=>item.id===list).id)!=undefined"
                                        >
                                            Отозвать заявку на участие
                                        </v-btn>
                                    </div>
                                    <div v-if="!applicationForEvent.find(item=>item.fndId === itemOfEvent.fnds.find(item=>item.id===list).id )">
                                        <v-btn
                                                @click="sendApplication(itemOfEvent.fnds.find(item=>item.id===list).id,itemOfEvent.id)">
                                            Подать заявку на участие
                                        </v-btn>
                                    </div>

                                </v-card-actions>
                            </v-card>
                        </v-sheet>
                    </v-col>
                    <v-col cols="2"/>
                </v-row>
            </v-container>
        </v-main>
    </v-app>

</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {ApplicationForParticipationInTheEvent} from "@prisma/client";

const route = useRoute()
const {data: itemOfEvent, pending, refresh} = await useFetch(`/api/event/${route.params.id}`);

const itemsOfFnds = itemOfEvent.value.fnds.map(item => {
    return {title: item.nameFND, value: item.id}
})
const list = ref()
const applicationForEvent = ref([])
const {email, name} = storeToRefs(useUserStore())


async function sendApplication(idFnd: number, idEvent: number) {
    await $fetch('/api/ApplicationForParticipationInTheEvent/create', {
        method: "post",
        body: {
            idFnd: idFnd,
            idEvent: idEvent,
            userEmail: email.value
        }
    });
    getApplication()
}

async function undoSendApplication(idFnd: number, idEvent: number) {
    await $fetch('/api/ApplicationForParticipationInTheEvent/revoke', {
        method: 'PATCH',
        params: {
            idFnd: +idFnd,
            idEvent: +idEvent,
            userEmail: email.value
        }
    });
    getApplication()
}

async function getApplication() {
    applicationForEvent.value = await $fetch('/api/ApplicationForParticipationInTheEvent/one', {
        params: {
            idEvent: itemOfEvent.value.id,
            userEmail: email.value
        }
    })
}

getApplication()

function checkApplication() {

}
</script>

<style scoped lang="scss">
.description-container {
    max-width: 600px;
    font-family: Arial, sans-serif;
}

.toggle-content {
    display: none;
}

.description {
    height: 4.5em;
    overflow: hidden;
}

.toggle-content:checked ~ .description {
    height: auto;
}

.toggle-content-label {
    display: block;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}

.toggle-content:checked ~ .toggle-content-label {
    display: none;
}

// Общие стили
body {
  font-family: "Roboto", sans-serif;
}

// Главный контейнер
.bg-grey-lighten-3 {
  background-color: #f5f5f5;
}

// Стили для изображений
.v-img {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

// Стили для карточек
.v-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

// Заголовок карточки
.v-card-title {
  font-weight: bold;
  font-size: 24px;
  color: #424242;
}

// Подзаголовок карточки
.v-card-subtitle {
  font-size: 18px;
  color: #757575;
  margin-bottom: 10px;
}

// Текст карточки
.v-card-text {
  font-size: 16px;
  color: #424242;
}

// Стили для списка
.v-list {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

// Элемент списка
.v-list-item {
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
}

// Заголовок элемента списка
.v-list-item-title {
  font-size: 18px;
  color: #424242;
}

// Кнопка подачи заявки на участие
.v-btn {
  color: white;
  background-color: #3f51b5;

  &:hover {
    background-color: #283593;
  }
}
</style>