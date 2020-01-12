
async function loadDictionary() {
}

function randomColor() {
    return "rgb(12, 244, 22)";
}

export default {
    template: `<div>
                <h1>{{messageLog}}</h1>
                <v-btn @click=AddRandomWords :disabled=!isFinishedLoading color="success">Add new words</v-btn>
                <h1 v-for="words in wordsArrays">
                    <div>
                    <v-chip v-for="word in words" color="randomColor()">
                        {{ word }}
                    </v-chip>
                    </div>
                </h1>
               </div>
              `,

    created: async function() {
            console.log('Loading');
            var res = await fetch('./assets/dict/words_dictionary.json');
            this.wordsDictionary = Object.keys(await res.json());
            this.messageLog = 'Words loaded, Ready to go!'
            this.isFinishedLoading = true;
    },

    methods: {
        AddRandomWords: function() {
            console.log("Adding Words");
            let times = 2 + Math.floor(Math.random()*3);
            
            var result = [];
            for (var i = 0; i < times; i++) {
                let index = Math.floor(Math.random()*this.wordsDictionary.length);
                result.push(this.wordsDictionary[index]);
            }

            this.wordsArrays.push(result);
        },
    },

    data: function() {
        return {
            isFinishedLoading: false,
            messageLog: 'Loading Words, Please Wait...',
            wordsDictionary: ['asdasd'],
            wordsArrays: [],
        };
    },
}
