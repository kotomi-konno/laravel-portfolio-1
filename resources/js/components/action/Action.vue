<template>
    <div class="actionComponent">
        <h2>活動記録</h2>
        <p>活動日を選択すると、登録済目標に対して活動を記録できます。</p>

        <!-- ページャー -->
        <div class="pager">
            <router-link v-if="month == 1" :to="`/action/${Number(year)-1}/12`">＜</router-link>
            <router-link v-if="month != 1" :to="`/action/${year}/${Number(month)-1}`">＜</router-link>
            <h3 class="cmn_pageTitle">{{ year }}年 {{ month }}月</h3>
            <router-link v-if="month == 12" :to="`/action/${Number(year)+1}/1`">＞</router-link>
            <router-link v-if="month != 12" :to="`/action/${year}/${Number(month)+1}`">＞</router-link>
        </div>

        <!-- カレンダー作成 -->
        <div class="calendar">
            <!-- 曜日表示 -->
            <ul class="indent">
                <li class="indent_item">月</li>
                <li class="indent_item">火</li>
                <li class="indent_item">水</li>
                <li class="indent_item">木</li>
                <li class="indent_item">金</li>
                <li class="indent_item">土</li>
                <li class="indent_item">日</li>
            </ul>

            <!-- 日付表示 -->
            <ul class="content">
                <li v-for="(n,index) in first_cnt" :key="index+100" class="content_item blank"></li>

                <li v-for="calendar in calendars" :key="calendar.date" class="content_item main" :class='{"is_today": calendar.date == todayDate }'>

                    <router-link :to="`/actionsave/${calendar.date}`">
                        <span class="content_item_d"  >{{ calendar.date|dateformat }}</span>
                        <ul class="content_item_action" style="font-size: 9px;">
                            <li v-for="(actionRecord, index) in calendar.actionRecords" :key="index">
                                <span v-if="actionRecord.actionTime">・{{ actionRecord.actionTime }}（{{actionRecord.actionContent}}）</span>
                            </li>
                        </ul>
                    </router-link>
                </li>

                <li v-for="(n,index) in last_cnt" :key="index" class="content_item blank"></li>
            </ul>

        </div>
        <!-- カレンダー↑↑↑↑ -->

    </div>
</template>


<script>
import moment from "moment";

export default {
    data() {
        return {
            year: 0,
            month: 0,
            actions: [],
            calendars: [],
            first_cnt: 0,
            last_cnt: 0,
            lastday: 0,
            today: new Date(),
            todayDate: 0,
        };
    },
    methods: {
        actionRead() {
            axios.get("/api/action/read").then((res) => {
                this.actions = res.data;
                // actionsのdone_dateとcalendarsのdateが一致するときにcalendars.actionsのactionTimeとactionContentにactionsのdone_timeと、goals_contentを入れる
                for (let i = 0; i < this.actions.length; i++) {
                    for (let t = 0; t < this.calendars.length; t++) {
                        if (
                            this.actions[i].done_date === this.calendars[t].date
                        ) {
                            this.calendars[t].actionRecords.push({
                                actionTime: this.actions[i].done_time,
                                actionContent: this.actions[i].goals_content,
                            });
                        }
                    }
                }
                console.log(res.data);
            });
        },

        // カレンダー作成
        getCalendar() {
            this.actionRead();
            this.year = this.$route.params.year;
            this.month = this.$route.params.month;
            // ①最終日の日付を求める→OK
            this.lastday = new Date(this.year, this.month, 0).getDate();
            // ②最初と最後の空欄の数を求める
            this.first_cnt =
                (6 + new Date(this.year, this.month - 1, 1).getDay()) % 7;
            this.last_cnt = (42 - (this.first_cnt + this.lastday)) % 7;
            // ③配列calendarsの中身を一旦空にする
            this.calendars.splice(0, this.calendars.length);
            // ④配列の中身を追加する
            for (let i = 0; i < this.lastday; i++) {
                this.calendars.push({
                    date:
                        this.year +
                        "-" +
                        ("00" + this.month).slice(-2) +
                        "-" +
                        ("00" + Number(i + 1)).slice(-2),

                    actionRecords: [
                        {
                            actionTime: "",
                            actionContent: "",
                        },
                        {
                            actionTime: "",
                            actionContent: "",
                        },
                    ],
                });
            }
        },
        // 今日の日付をyyyy-MM-ddの形で取得する（calendar.dateと同じ形にしたい）
        isToday() {
            this.todayDate =
                this.today.getFullYear() +
                "-" +
                ("00" + (this.today.getMonth() + 1)).slice(-2) +
                "-" +
                ("00" + this.today.getDate()).slice(-2);
        },
    },
    mounted() {
        this.getCalendar();
        this.isToday();
    },

    watch: {
        $route: "getCalendar",
    },
    filters: {
        dateformat: function (date) {
            return moment(date).format("D");
        },
        // timeformat: function (time) {
        //     return moment(time).format("HH:mm");
        // },
    },
};
</script>




<style lang="scss" scoped>
.actionComponent {
    p {
        text-align: center;
        color: red;
    }
    .pager {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 30px 0 20px 0;
        h3 {
            margin: 0;
        }
        a {
            font-size: 30px;
            color: #607d8b;
            padding: 0 25px;
            &:hover {
                text-decoration: none;
            }
        }
    }
}

form {
    position: relative;
    .vue-loading-wrap {
        position: absolute;
    }
}
// 曜日表示
.indent {
    display: flex;
    margin-bottom: 0;
    &_item {
        // 100%の幅を7等分にした幅のこと
        width: calc(100% / 7);
        text-align: center;
        padding-bottom: 10px;
        list-style: none;
        &:nth-child(7) {
            color: red;
        }
        &:nth-child(6) {
            color: blue;
        }
    }
}
.content {
    display: flex;
    flex-wrap: wrap;
    ul li {
        list-style: none;
    }
    &_item {
        list-style: none;
        width: calc(100% / 7);
        height: 100px;
        padding: 8px 5px 5px;
        border-left: 1px solid grey;
        border-bottom: 1px solid grey;
        &:nth-child(7n-1) {
            span {
                color: blue;
            }
        }
        &:nth-child(7n) {
            border-right: 1px solid grey;
            span {
                color: red;
            }
        }
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(5),
        &:nth-child(6),
        &:nth-child(7) {
            border-top: 1px solid grey;
        }
        &.main {
            font-size: 13px;
            a {
                display: block;
                height: 100%;
                width: 100%;
                text-decoration: none;
                .content_item_action li span {
                    color: black;
                }
            }
            &:hover {
                background-color: rgba(237, 237, 237);
            }
        }
        &.blank {
            background-color: rgb(213, 213, 213);
        }
        &.is_today {
            background-color: rgba(253, 255, 192, 0.527);
        }
    }
}
</style>
