<template>
    <div class="goal">

        <div class="goalpage_inner">
            <h2>目標</h2>
            <p>登録済の目標確認や、新しく目標を登録することができます。</p>
            <router-link to="/goalcreate" class="goalcreateBtn">目標を登録する</router-link>

            <h3>目標一覧</h3>

            <ul>
                <li v-for="(goal, index) in goals" :key="index">
                    <div class="goalpage_inner_main">
                        <!-- ユーザー：<span>{{ goal.users_name }}（ID：{{goal.users_id}}）</span><br> -->
                        内容：<span v-if="!goal.edit">{{ goal.content }}</span>
                        <input v-if="goal.edit" v-model="goal.content" type="text"><br>

                        締切日：<span v-if="!goal.edit">{{ goal.deadline }}</span>
                        <input v-if="goal.edit" v-model="goal.deadline" type="date"><br>

                        目標時間：<span v-if="!goal.edit">{{ goal.time }}</span>
                        <select v-if="goal.edit" v-model="goal.time">
                            <option v-for="(n, index) in 60" :key="index" :value="`${n}:00`">{{n}}:00</option>
                        </select><br>

                        達成したかどうか：<input v-if="!goal.edit" type="checkbox" v-model="goal.completed" disabled>
                        <input v-if="goal.edit" type="checkbox" v-model="goal.completed">
                    </div>

                    <div class="goalpage_inner_btn">
                        <!-- <button  class="goalpage_inner_btn_records">活動履歴を見る</button><br> -->
                        <button v-if="!goal.edit" @click="goal.edit = true">編集</button>
                        <button v-if="goal.edit" @click="goalUpdate(index)">更新</button>
                        <button @click="goalDelete(goal.id)">削除</button>
                    </div>
                </li>
            </ul>
            <div v-show="isShow" class="pagination">
                <v-pagination v-model="nowPage" :length="pagesCount" @input="getNumber"></v-pagination>
            </div>

            <!-- <pre>{{$data.goals}}</pre> -->

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isShow: false,
            nowPage: 1,
            pagesCount: 0,
            itemsNum: 1,
            displayDataCount: 3,
            user: {},

            goalDatas: [], // ゴールデータ全て
            myGoalDatas: [],// ログインユーザーのゴールデータ全て
            goals: [],// 今のページに表示されているデータ（1ページ5件なら5個あるはず）
        };
    },
    methods: {
        goalRead() {
            axios.get("/api/goal/read").then((res) => {
                this.goalDatas = res.data;
                this.isShow = true;
                for (let i = 0; i < this.goalDatas.length; i++) {
                    if (this.goalDatas[i].users_id == this.user.id) {
                        this.myGoalDatas.push(this.goalDatas[i]);
                    }
                }
                this.getNumber(1);

                this.goals.forEach((goal) => {
                    this.$set(goal, "edit", false);
                });
            });
        },
        getNumber(nowPage) {
            let dataCount = this.myGoalDatas.length;//表示する全データ数
            console.log(this.myGoalDatas.length);
            this.pagesCount = Math.ceil(dataCount / this.displayDataCount);//総ページ数
            this.goals.splice(0, this.goals.length);//表示されているgoalsデータのリセット
            for (let i = 0; i < this.displayDataCount; i++) {
                let firstIndex = this.displayDataCount * (nowPage - 1);//そのページの最初のデータのインデックス
                if (i + firstIndex < dataCount) {
                    this.goals.push(
                        this.myGoalDatas[ firstIndex + i ]
                    );
                }
            }

        },
        goalUpdate(index) {
            this.goals[index].edit = false;
            axios.put("/api/goal/update", this.goals[index]).then((res) => {
                this.goalRead();
            });
        },
        goalDelete(id) {
            if (confirm("この目標を削除しても良いですか？")) {
                axios.delete("/api/goal/delete/" + id).then((res) => {
                    this.goalRead();
                });
            }
        },
        getLoginUser() {
            axios.get("/api/loginuser").then((res) => {
                this.user = res.data;
            });
        },
    },
    mounted() {
        this.getLoginUser();
        this.goalRead();
    },
};
</script>
<style lang="scss" scoped>
.goalpage_inner {
    text-align: center;
    p{
        color: red;
    }
    .goalcreateBtn {
        display: block;
        text-align: center;
        text-decoration: none;
        margin: 30px auto;
        width: 25%;
        padding: 8px;
        background-color: #07889b;
        color: #fff;
        border-bottom: solid 4px #07414f9a;
        border-radius: 5px;
        font-weight: bold;
        font-size: 15px;
        &:active {
            transform: translateY(4px);
            border-bottom: none;
        }
    }
    ul {
        padding: 0;
        li {
            background-color: white;
            border-bottom: 3px solid rgb(229, 227, 227);
            border-radius: 10px;
            margin: 15px 0;
            list-style: none;
            display: flex;
            justify-content: space-around;
            padding: 15px 0;
            .goalpage_inner_main{
                flex-basis: 50%;
                text-align: left;
                font-size: 15px;
                margin: 0 auto;
            }
            .goalpage_inner_btn {
                flex-basis: 40%;
                button {
                background-color: #ffc107;
                border: none;
                border-bottom: solid 3px #7b68308a;
                padding: 4px 13px;
                    &:active {
                        transform: translateY(4px);
                        border-bottom: none;
                    }
                }
            }
        }
    }
    h3 {
        text-align: center;
    }
    select{
        width: 30%;
        border: 0.5px solid grey;
        border-radius: 5px;
        padding: 5px;
        font-size: 12px;
    }
}

.pagination {
    max-width: 500px;
    margin: 20px auto;
    justify-content: center;
    nav ::v-deep .v-pagination {
        &__item {
            box-shadow: none;
            border-radius: 50%;
            color: #607d8b;
            border: 1px solid#607d8b;
            &--active {
                color: white;
                background-color: #607d8b;
            }
        }
        &__navigation {
            border: none;
            box-shadow: none;
            background-color: transparent;
            .theme--light.v-icon {
                color: #607d8b;
                font-size: 30px;
            }
            &--disabled {
                opacity: 0.2;
            }
        }
    }
}
</style>