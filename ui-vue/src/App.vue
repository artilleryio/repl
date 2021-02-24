<template>
  <div id="app">
        <div class="container mx-auto p-6">
        <vue-tailwind-modal :showing="shareModalShowing" @close="shareModalShowing = false" :showClose="true" :backgroundClose="true">
          <input type=text style="width: 100%" disabled=true :value="scenarioUrl" />
        </vue-tailwind-modal>

        <h1 style="fontFamily: Martel" class="fg-gradient-purple-red text-4xl pb-3 tracking-tight font-extrabold sm:text-5xl md:text-5xl">
          API REPL
        </h1>

        <p class="text-s pb-6">
          This is a universal API REPL. Send requests, see responses, and explore any public API. <a href="" class="underline" v-on:click="toggleLearnMore">Learn more &darr;</a>
        </p>

        <div class="text-xs" v-if="learnMore">
          You've probably used something like Postman, HTTPie, or curl to interact with HTTP APIs before. This is similar, but also different:

          <div class="px-9 py-3">
            <ul style="listStyleType:disc">
              <li>It's code-first - for those who prefer code over elaborate UIs</li>
              <li>You can build <em>scenarios</em> rather than just send a single request at a time</li>
              <li>Not just HTTP - try the WebSocket or Socket.io examples</li>
              <li>Scenarios you write here can be used for load testing and synthetic monitoring with Artillery</li>
              <li>Powered by <a href="https://artillery.io">Artillery</a> ⚡ and packed with features; see <a href="https://artillery.io/docs" class="underline">the docs</a></li>
            </ul>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="border-solid border-4 border-light-blue-500">
            <!-- Two-way Data-Binding -->
            <!-- <codemirror v-model="code" :options="cmOptions" /> -->

            <div class="codemirror">
              <codemirror
                ref="cmEditor"
                :value="code"
                :options="cmOptions"
                @ready="onCmReady"
                @focus="onCmFocus"
                @input="onCmCodeChange"
              />
              </div>
            </div>
            <div class="border-solid border-4 border-light-blue-500" style="height: 50vh">
              <div id="results" ref="items" style="height: 50vh">
                    <span v-for="item in items" :key="item.data">
                      <pre>{{ item.data }}</pre>
                    </span>
              </div>
            </div>
      </div>

      <div>
        <button 
          class="inline-flex mr-6 mt-3 items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          v-on:click="run">⚡ Run scenario
        </button>

        <button 
          class="inline-flex mr-6 mt-3 items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          v-on:click="share"> Share
        </button>

        <label for="examples" class="font-bold font-medium">Load an example</label>:
        <select name="examples" id="examples" class="mt-1 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="ws-hello">HTTP Hello World!</option>
          <option value="http-chain">HTTP request chaining</option>
          <option value="ws-hello">WebSocket Hello World</option>
          <option value="socketio-hello">Socket.io Hello World</option>
        </select>

      </div>

        <hr class="mt-12 mb-3" />

        <div>
          <ul class="text-xs">
          </ul>
        </div>

    </div> <!-- container -->
  </div>
</template>
 
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/theme/base16-dark.css'

function run () {
  // TODO: Reconnect if needed - ensure we're connected first

  this.items = [];
  console.log('run ->');
  console.log(this.code);
  const enc = btoa(this.code);
  window.ws.send(JSON.stringify({input: enc, opts:{}}));
}

const defaultContents = `# Write your scenario here and press Run to run it!
config:
  target: "https://artillery.io" # this the endpoint we want to interact with
  phases:
    - duration: 10
      arrivalRate: 1
scenarios:
  - flow:
      - get:
          url: "/"
          expect:
            statusCode: 200
      - get:
          url: "/docs"
          expect:
            statusCode: 200
`;
console.log(defaultContents);

const POST_ENDPOINT = 'dev/save'
const GET_ENDPOINT = 'dev/get'

// these are here just because artillery is spitting out an update error that is breaking base64 encoding/decoding
function base64encode(str) {
  let encode = encodeURIComponent(str).replace(/%([a-f0-9]{2})/gi, (m, $1) => String.fromCharCode(parseInt($1, 16)))
  return btoa(encode)
}

function base64decode(str) {
  let decode = atob(str).replace(/[\x80-\uffff]/g, (m) => `%${m.charCodeAt(0).toString(16).padStart(2, '0')}`)
  return decodeURIComponent(decode)
}

const getScenario = async (key) => {
  if (!key) {
    return
  }

  const response = await fetch(`${GET_ENDPOINT}/${key}`)
  const data = await response.json()

  return {
    scenario: base64decode(data.scenario),
    output: base64decode(data.output),
  }
}

export default {
  name: 'App',
  components: {
    codemirror
  },
  data() {
    return {
      code: defaultContents,
      learnMore: false,
      shareModalShowing: false,
      scenarioUrl: '',
      cmOptions: {
        tabSize: 4,
        mode: 'text/yaml',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
        // more CodeMirror options
      },

      items: [1, 2, 3]
    }
  },
  methods: {
    toggleLearnMore(e) {
      this.learnMore = !this.learnMore;
      e.preventDefault();
    },
    setItems(items) {
      this.items = items;
    },
    run,
    async share() {
      try {
        const scenario = btoa(this.code);
        const output = this.$root.$children[0].items.reduce((s, item) => {
          if (item.data) {
            return `${s}${item.data}`
          }

          return s
        }, '')

        const response = await fetch(POST_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify({
            scenario,
            output: base64encode(output)
          })
        })

        if (response.ok) {
          const { key } = await response.json()

          this.scenarioUrl = `https://repl.artillery.io/#/${key}`
          this.shareModalShowing = true
        }
      } catch(err) {
        console.log(err)
      }
    },
    editorMounted(editor, monaco) {
      monaco.languages.register('json');
    },
    onCmReady(cm) {
      console.log('the editor is redy', cm)
    },
    onCmFocus(cm) {
      console.log('the editor is focused', cm)
    },
    onCmCodeChange(newCode) {
      console.log('new code:', newCode)
      this.code = newCode
    }
  },
  computed: {
    codemirror() {
      return this.$refs.cmEditor.codemirror
    },
    wsConnected() {
      return (typeof window.ws !== undefined);
    }
  },
  async mounted() {
    console.log('the current CodeMirror instance object:', this.codemirror)

    if (this.$route.params.key) {
      const { scenario, output } = await getScenario(this.$route.params.key);

      this.code = scenario
      this.items = [{
        data: output
      }]
    }
  }
};
</script>
