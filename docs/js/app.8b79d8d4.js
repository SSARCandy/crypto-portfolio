(function(t){function e(e){for(var a,o,r=e[0],l=e[1],_=e[2],d=0,u=[];d<r.length;d++)o=r[d],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&u.push(i[o][0]),i[o]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a]);c&&c(e);while(u.length)u.shift()();return n.push.apply(n,_||[]),s()}function s(){for(var t,e=0;e<n.length;e++){for(var s=n[e],a=!0,r=1;r<s.length;r++){var l=s[r];0!==i[l]&&(a=!1)}a&&(n.splice(e--,1),t=o(o.s=s[0]))}return t}var a={},i={app:0},n=[];function o(e){if(a[e])return a[e].exports;var s=a[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=t,o.c=a,o.d=function(t,e,s){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(o.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)o.d(s,a,function(e){return t[e]}.bind(null,a));return s},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/crypto-portfolio/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],l=r.push.bind(r);r.push=e,r=r.slice();for(var _=0;_<r.length;_++)e(r[_]);var c=l;n.push([0,"chunk-vendors"]),s()})({0:function(t,e,s){t.exports=s("56d7")},"0a3b":function(t,e,s){},"10a0":function(t,e,s){},"13ad":function(t,e,s){"use strict";s("10a0")},"28a1":function(t,e,s){},"2a58":function(t,e,s){"use strict";s("c392")},3146:function(t){t.exports=JSON.parse('{"switch_chart":"チャート表示切り替え","tag":"タグ","asset":"トークン","wallet":"ウォレット","size":"サイズ","price":"価格","price_changes":"変化率%","notional_value":"価値","entry":"エントリー","pnl":"利益と損失","pnl_return":"リターン","note":"メモ","total_unrealized_pnl":"未実現損益合計","today_pnl":"今日の利益と損失","today_pnl_error_msg":"全てのアセットタイプが表示されている場合のみ有効な PnL です","update_time":"更新時刻","save":"保存","saved":"完了！","sec_ago":"秒前","date":"日付","nav":"純資産価値","nav_page":"純資産価値","diff":"日次利益と損失","estimate_total_cost":"総コスト見積り","export_as_csv":"CSV でエクスポート","7d":"7 日","30d":"30 日","90d":"90 日","180d":"180 日","365d":"365 日","all":"全歷史","positions_count":"ポジション数","symbol":"シンボル","position_notional":"評価額","mark_price":"マークプライス","initial_size":"初期サイズ","unrealized_pnl":"損益","total_initial_size":"総初期サイズ","total_position_size":"総価値","dark_mode":"ダークモード","hide_small_balance":"小額残高を非表示 (純資産価値の 0.1% 未満）","show_return_in_small_device":"小型デバイスでリターン（%）を表示","is_merge_wallets":"パイチャートで同じコインのウォレットを統合する","is_show_nav_title":"「総資産」をウェブページのタイトルに表示する","language":"言語切り替え","timeframe":"価格変動に使用される時間枠","asset_type":"表示するアセットタイプ"}')},"56d7":function(t,e,s){"use strict";s.r(e);var a=s("2b0e"),i=s("a925"),n=s("003c"),o=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("Main")],1)},r=[],l=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"main"}},[e("div",{attrs:{id:"quick-access"}},[e("button",{staticClass:"setting-btn",on:{click:function(e){t.is_setting_mode=!t.is_setting_mode}}},[e("i",{staticClass:"fas fa-fw fa-cog"})]),e("div",{staticStyle:{display:"flex"}},[e("button",{directives:[{name:"show",rawName:"v-show",value:!t.is_nav_mode&&!t.is_position_mode,expression:"!is_nav_mode && !is_position_mode"}],staticClass:"setting-btn",on:{click:function(e){t.is_exchange_chart=!t.is_exchange_chart}}},[e("i",{staticClass:"fas fa-fw fa-chart-pie"})]),e("div",{staticStyle:{width:"20px"}}),e("button",{staticClass:"setting-btn",on:{click:function(e){t.is_position_mode=!t.is_position_mode,t.is_nav_mode=!1}}},[e("i",{staticClass:"fas fa-fw fa-scroll"})]),e("button",{staticClass:"setting-btn",on:{click:function(e){t.is_nav_mode=!t.is_nav_mode,t.is_position_mode=!1}}},[e("i",{staticClass:"fas fa-fw fa-chart-line"})])])]),e("setting",{attrs:{is_setting_mode:t.is_setting_mode,is_dark_mode:t.is_dark_mode,is_hide_small_balance:t.is_hide_small_balance,is_perfer_return:t.is_perfer_return,is_merge_wallets:t.is_merge_wallets,is_show_nav_title:t.is_show_nav_title,language:t.language,timeframe:t.timeframe,asset_type:t.asset_type},on:{"update:is_setting_mode":function(e){t.is_setting_mode=e},"update:is_dark_mode":function(e){t.is_dark_mode=e},"update:is_hide_small_balance":function(e){t.is_hide_small_balance=e},"update:is_perfer_return":function(e){t.is_perfer_return=e},"update:is_merge_wallets":function(e){t.is_merge_wallets=e},"update:is_show_nav_title":function(e){t.is_show_nav_title=e},"update:language":function(e){t.language=e},"update:timeframe":function(e){t.timeframe=e},"update:asset_type":function(e){t.asset_type=e}}}),t.is_nav_mode?e("account-value",{attrs:{daily_nav:t.daily_nav,estimate_total_cost:t.estimate_total_cost}}):t._e(),t.is_position_mode?e("position-view",{attrs:{positions:t.positions}}):t._e(),t.is_nav_mode||t.is_position_mode?t._e():e("div",[e("pie-chart",{attrs:{assets:t.chart_data}}),e("ul",t._l(t.assets,(function(s){return e("li",{directives:[{name:"show",rawName:"v-show",value:"APP_ERROR"==s.asset,expression:"asset.asset == 'APP_ERROR'"}],key:s.asset+s.wallet,staticClass:"sell"},[t._v(" "+t._s(s.wallet)+" KEY ERROR ")])})),0),e("table",{attrs:{id:"asset"}},[e("tr",[t.should_show("tag")?e("th",{on:{click:function(e){return t.change_sortkey("tag")}}},[t._v(" "+t._s(t.sorted_icon("tag"))+t._s(t.$t("tag"))+" ")]):t._e(),t.should_show("wallet")?e("th",{on:{click:function(e){return t.change_sortkey("wallet")}}},[t._v(" "+t._s(t.sorted_icon("wallet"))+t._s(t.$t("wallet"))+" ")]):t._e(),e("th",{on:{click:function(e){return t.change_sortkey("asset")}}},[t._v(" "+t._s(t.sorted_icon("asset"))+t._s(t.$t("asset"))+" ")]),t.should_show("price_changes")?e("th",{on:{click:function(e){return t.change_sortkey("price_changes")}}},[t._v(" "+t._s(t.sorted_icon("price_changes"))+t._s(t.timeframe)+" "+t._s(t.$t("price_changes"))+" ")]):t._e(),e("th",{on:{click:function(e){return t.change_sortkey("price")}}},[t._v(" "+t._s(t.sorted_icon("price"))+t._s(t.$t("price"))+" ")]),e("th",{on:{click:function(e){return t.change_sortkey("entry")}}},[t._v(" "+t._s(t.sorted_icon("entry"))+t._s(t.$t("entry"))+" ")]),e("th",{on:{click:function(e){return t.change_sortkey("size")}}},[t._v(" "+t._s(t.sorted_icon("size"))+t._s(t.$t("size"))+" ")]),e("th",{on:{click:function(e){return t.change_sortkey("notional_value")}}},[t._v(" "+t._s(t.sorted_icon("notional_value"))+t._s(t.$t("notional_value"))+" ")]),t.should_show("pnl")?e("th",{on:{click:function(e){return t.change_sortkey("pnl")}}},[t._v(" "+t._s(t.sorted_icon("pnl"))+t._s(t.$t("pnl"))+" ")]):t._e(),t.should_show("pnl_return")?e("th",{on:{click:function(e){return t.change_sortkey("pnl_return")}}},[t._v(" "+t._s(t.sorted_icon("pnl_return"))+t._s(t.$t("pnl_return"))+" ")]):t._e(),t.screen_width>500?e("th",[t._v(t._s(t.$t("note")))]):t._e()]),t._l(t.assets_table,(function(s){return e("tr",{directives:[{name:"show",rawName:"v-show",value:"APP_ERROR"!=s.asset&&(!t.is_hide_small_balance||s.size*s.price>t.small_balance_threshold),expression:"asset.asset != 'APP_ERROR' && (!is_hide_small_balance || asset.size * asset.price > small_balance_threshold)"}],key:s.asset+s.wallet},[t.should_show("tag")?e("td",{staticClass:"btn-tag",style:t.tagcolor(t.userdata[t.symbol_key(s.asset,s.wallet,"tag")]),on:{click:function(e){t.change_tag(t.symbol_key(s.asset,s.wallet,"tag"))}}},[t._v(" "+t._s(void 0!==t.userdata[t.symbol_key(s.asset,s.wallet,"tag")]?t.userdata[t.symbol_key(s.asset,s.wallet,"tag")]+1:"")+" ")]):t._e(),t.should_show("wallet")?e("td",[t._v(t._s(s.wallet))]):t._e(),e("td",[t._v(t._s(s.asset))]),t.should_show("price_changes")?e("td",{class:t.color(s.price_changes),staticStyle:{width:"0px"}},[t._v(" "+t._s(t._f("Precentage")(s.price_changes,1))+" ")]):t._e(),e("td",[t._v(t._s(t._f("toPrecision")(s.price,5)))]),e("td",{staticClass:"entry-price"},[e("input",{directives:[{name:"model",rawName:"v-model.lazy",value:t.userdata[t.entry_k(s.asset,s.wallet)],expression:"userdata[entry_k(asset.asset, asset.wallet)]",modifiers:{lazy:!0}}],attrs:{type:"number"},domProps:{value:t.userdata[t.entry_k(s.asset,s.wallet)]},on:{change:function(e){t.$set(t.userdata,t.entry_k(s.asset,s.wallet),e.target.value)}}})]),e("td",{directives:[{name:"tooltip",rawName:"v-tooltip",value:s.size.toString(),expression:"asset.size.toString()"}]},[t._v(" "+t._s(t._f("nFormatter")(s.size,3))+" ")]),e("td",[t._v(t._s(t._f("Number")(s.notional_value,0)))]),t.should_show("pnl")?e("td",{class:t.color(s.pnl)},[t._v(" "+t._s(t._f("Number")(s.pnl,0))+" ")]):t._e(),t.should_show("pnl_return")?e("td",{class:t.color(s.pnl)},[t._v(" "+t._s(t._f("Precentage")(s.pnl_return,1))+" ")]):t._e(),t.screen_width>500?e("td",{staticClass:"entry-price",staticStyle:{"max-width":"200px"}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.userdata[t.symbol_key(s.asset,s.wallet,"note")],expression:"userdata[symbol_key(asset.asset, asset.wallet, 'note')]"}],domProps:{value:t.userdata[t.symbol_key(s.asset,s.wallet,"note")]},on:{input:function(e){e.target.composing||t.$set(t.userdata,t.symbol_key(s.asset,s.wallet,"note"),e.target.value)}}})]):t._e()])}))],2),e("footer",{staticStyle:{display:"flex","justify-content":"space-between"}},[e("ul",{staticStyle:{"list-style":"none","padding-left":"0"}},[e("li",[t._v(" "+t._s(t.$t("total_unrealized_pnl"))+": "),e("span",{class:t.color(t.sum_pnl(t.assets_table))},[t._v(" "+t._s(t._f("Number")(t.sum_pnl(t.assets_table),0))+" ")])]),e("li",[t._v(" "+t._s(t.$t("today_pnl"))+": "),"all"===t.asset_type?e("span",{class:t.color(t.today_pnl())},[t._v(" "+t._s(t._f("Number")(t.today_pnl(),0))+" ")]):t._e(),"all"!==t.asset_type?e("span",[t._v(" "+t._s(t.$t("today_pnl_error_msg"))+" ")]):t._e()]),e("li",[t._v(" "+t._s(t.$t("estimate_total_cost"))+": "),e("span",[t._v(" "+t._s(t._f("Number")(t.estimate_total_cost,0))+" ")])]),e("li",[e("Timer",{attrs:{time:t.time}})],1)]),e("button",{staticClass:"save",on:{click:t.save}},[t._v(" "+t._s(t.saved?t.$t("saved"):t.$t("save"))+" ")])])],1)],1)},_=[],c=(s("88a7"),s("271a"),s("5494"),s("13d5"),s("5716"),s("be6f")),d=function(){var t=this,e=t._self._c;return e("highcharts",{staticStyle:{height:"400px",width:"500"},attrs:{id:"pie",options:t.chartOptions}})},u=[],p=s("d180"),h=s.n(p),m=s("93c6"),f=s.n(m),v=s("4452"),g={name:"PieChart",props:{assets:Array},components:{highcharts:v["Chart"]},data(){return{dragging:!1,chart_size:null,startAngle:0,startAngleOffset:0}},computed:{nav:function(){return h()(this.assets.map(({value:t})=>t))},chartOptions:function(){return{accessibility:{enabled:!1},chart:{type:"pie",animation:!1},plotOptions:{pie:{size:"80%",innerSize:"80%",dataLabels:{distance:"2%",alignTo:"toPlotEdges",filter:{property:"percentage",operator:">",value:5},overflow:"allow",crop:!0}},series:{animation:{duration:500}}},title:{verticalAlign:"middle",floating:!0,text:"Total<br>$"+new Intl.NumberFormat("en-US",{maximumFractionDigits:0,minimumFractionDigits:0}).format(this.nav)},tooltip:{pointFormat:"<b>{point.percentage:.1f}%</b><br><b>${point.y:.0f}</b>"},series:[{name:"",colorByPoint:!0,startAngle:this.startAngle,data:f()(this.assets,"value","desc").map(t=>[t.name,t.value])}]}}},methods:{getDegree(t){const e=t.offsetX?t.offsetX:t.touches[0].clientX,s=t.offsetY?t.offsetY:t.touches[0].clientY,[a,i]=this.chart_size,n=[a/2-e,i/2-s],o=Math.atan2(n[1],n[0]);return 57.29*o%360},startDrag(t){this.dragging=!0;const e=this.getDegree(t);this.startAngleOffset=this.startAngle-e},stopDrag(){this.dragging=!1},doDrag(t){if(this.dragging){const e=this.getDegree(t);this.startAngle=e+this.startAngleOffset}t.preventDefault(),t.stopImmediatePropagation()}},mounted(){const t=document.getElementById("pie");this.chart_size=[t.offsetWidth,t.offsetHeight],window.addEventListener("touchend",this.stopDrag,{passive:!1}),window.addEventListener("mouseup",this.stopDrag,{passive:!1}),t.addEventListener("mousedown",this.startDrag,{passive:!1}),t.addEventListener("mousemove",this.doDrag,{passive:!1}),t.addEventListener("touchstart",this.startDrag,{passive:!1}),t.addEventListener("touchmove",this.doDrag,{passive:!1})}},b=g,y=s("2877"),w=Object(y["a"])(b,d,u,!1,null,"0701d88d",null),k=w.exports,x=function(){var t=this,e=t._self._c;return e("div",[e("highcharts",{staticStyle:{height:"300px",width:"500"},attrs:{id:"account-nav",options:t.chartOptions}}),e("div",{staticClass:"flex-container"},[e("div",t._l(t.timeframes,(function(s){return e("button",{key:s.value,class:{selected:t.timeframe===s.value},on:{click:function(e){return t.pick_range(s.value)}}},[t._v(" "+t._s(t.$t(s.label))+" ")])})),0),e("export-table",{attrs:{table_id:"nav-table"}})],1),e("table",{attrs:{id:"nav-table"}},[e("tr",[e("th",[t._v(t._s(t.$t("date")))]),e("th",[t._v(t._s(t.$t("nav")))]),e("th",[t._v(t._s(t.$t("diff")))])]),t._l(t.reversed_data,(function(s,a){return e("tr",{key:s[0]},[e("td",[t._v(t._s(s[0]))]),e("td",[t._v("$ "+t._s(t._f("Number")(s[1],0)))]),e("td",{class:t.color(t.dail_pnl(a))},[t._v(" "+t._s(t._f("Number")(t.dail_pnl(a),0))+" ")])])}))],2)],1)},z=[];s("14d9");function S(t,e=","){const s=document.querySelectorAll("table#"+t+" tr"),a=[];for(let r=0;r<s.length;r++){const t=[],i=s[r].querySelectorAll("td, th");for(let e=0;e<i.length;e++){let s=i[e].innerText.replace(/(\r\n|\n|\r)/gm,"").replace(/(\s\s)/gm," ");s=s.replace(/"/g,'""'),s=s.replace(/[,$]/g,""),t.push('"'+s+'"')}a.push(t.join(e))}const i=a.join("\n"),n=t+"_"+(new Date).getTime()+".csv",o=document.createElement("a");o.style.display="none",o.setAttribute("target","_blank"),o.setAttribute("href","data:text/csv;charset=utf-8,"+encodeURIComponent(i)),o.setAttribute("download",n),document.body.appendChild(o),o.click(),document.body.removeChild(o)}function P(t){const e=Math.abs(t)>999?Math.sign(t)*(Math.abs(t)/1e3).toFixed(1)+"k":Math.sign(t)*Math.abs(t);return"$ "+e}const $={toFixed:(t,e=2)=>void 0==t?0:t.toFixed(e),toPrecision:(t,e)=>void 0==t||Math.abs(t)<1e-8?0:t.toPrecision(e),Number:(t,e)=>{if(void 0==t)return 0;const s="number"===typeof e?{maximumFractionDigits:e,minimumFractionDigits:e}:{};return new Intl.NumberFormat("en-US",s).format(t)},Precentage:(t,e=1)=>t===1/0?"Inf%":isNaN(t)?"--":(100*t||0).toFixed(e)+"%",nFormatter:(t,e)=>{const s=[{value:1e3,symbol:"k"},{value:1e6,symbol:"M"},{value:1e8,symbol:"B"}],a=/\.0+$|(\.[0-9]*[1-9])0+$/,i=s.slice().reverse().find((function(e){return t>=e.value}));return i?(t/i.value).toFixed(e-1).replace(a,"$1")+i.symbol:t.toFixed(e)}},O={color(t){return{buy:t>0,sell:t<0}}};var C=function(){var t=this,e=t._self._c;return e("button",{on:{click:t.download}},[t._v(t._s(t.$t("export_as_csv")))])},N=[],j={name:"ExportTable",props:{table_id:String},computed:{},methods:{download(){S(this.table_id)}},mounted(){}},A=j,E=Object(y["a"])(A,C,N,!1,null,"6ccc5614",null),R=E.exports,D=s("80f6"),T=s.n(D),F=s("1723"),M=s.n(F),V={name:"AccountValue",props:{daily_nav:Array,estimate_total_cost:Number},components:{highcharts:v["Chart"],ExportTable:R},data(){return{timeframe:30,timeframes:[{label:"7d",value:7},{label:"30d",value:30},{label:"90d",value:90},{label:"180d",value:180},{label:"365d",value:365},{label:"all",value:void 0}]}},filters:$,computed:{reversed_data:function(){return this.daily_nav.slice().reverse().slice(0,this.timeframe)},chartOptions:function(){return{accessibility:{enabled:!1},chart:{type:"area",animation:!1},legend:{enabled:!1},title:{text:this.$i18n.t("nav_page")},plotOptions:{areaspline:{threshold:null},series:{animation:{duration:500},marker:{radius:0},fillOpacity:0,dataLabels:{enabled:!0,verticalAlign:"top",y:-20,formatter:function(){if(this.y===this.series.dataMax)return P(this.y)}}}},xAxis:{type:"datetime",dateTimeLabelFormats:{day:"%d %b %Y"},labels:{rotation:0,format:"{value:%m-%d}"}},yAxis:{min:T()(this.reversed_data,t=>t[1])[1],max:M()(this.reversed_data,t=>t[1])[1],title:{enabled:!1},labels:{formatter:function(){return P(this.value)},style:{fontSize:9}}},tooltip:{pointFormat:"<b>${point.y:.0f}</b>"},series:[{name:this.$i18n.t("nav"),background:"#00f",fillOpacity:.3,data:this.daily_nav.map(t=>{const[e,s,a]=t[0].split("-");return[Date.UTC(e,+s-1,a),t[1]]}).slice(-this.timeframe)}]}}},methods:{...O,dail_pnl(t){return this.reversed_data[t][1]-this.reversed_data[Math.min(t+1,this.reversed_data.length-1)][1]},pick_range(t){this.timeframe=t}},mounted(){}},L=V,I=(s("2a58"),s("5d18"),Object(y["a"])(L,x,z,!1,null,"7cc8e4b4",null)),B=I.exports,J=function(){var t=this,e=t._self._c;return e("div",[e("footer",{staticStyle:{display:"flex","justify-content":"space-between"}},[e("ul",{staticStyle:{"list-style":"none","padding-left":"0"}},[e("li",[t._v(t._s(t.$t("positions_count"))+": "+t._s(t.positions.length))]),e("li",[t._v(t._s(t.$t("total_initial_size"))+": "+t._s(t._f("Number")(t.total_initial_size,0)))]),e("li",[t._v(t._s(t.$t("total_position_size"))+": "+t._s(t._f("Number")(t.total_posiion_size,0)))]),e("li",[t._v(" "+t._s(t.$t("total_unrealized_pnl"))+": "),e("span",{class:t.color(t.unrealized)},[t._v(" "+t._s(t._f("Number")(t.unrealized,0))+" ("+t._s(t._f("Precentage")(t.unrealized/t.total_initial_size,1))+") ")])])])]),e("div",{staticStyle:{display:"flex","justify-content":"space-between","padding-bottom":"5px"}},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.keywords,expression:"keywords"}],attrs:{type:"text",placeholder:"Search..."},domProps:{value:t.keywords},on:{input:function(e){e.target.composing||(t.keywords=e.target.value)}}}),e("export-table",{attrs:{table_id:"position-table"}})],1),e("table",{attrs:{id:"position-table"}},[e("tr",[e("th",{on:{click:function(e){return t.change_sortkey("symbol")}}},[t._v(" "+t._s(t.sorted_icon("symbol"))+t._s(t.$t("symbol"))+" ")]),e("th",{on:{click:function(e){return t.change_sortkey("markPrice")}}},[t._v(" "+t._s(t.sorted_icon("markPrice"))+t._s(t.$t("mark_price"))+" ")]),e("th",{on:{click:function(e){return t.change_sortkey("initial_size")}}},[t._v(" "+t._s(t.sorted_icon("initial_size"))+t._s(t.$t("initial_size"))+" ")]),e("th",{on:{click:function(e){return t.change_sortkey("unRealizedProfit")}}},[t._v(" "+t._s(t.sorted_icon("unRealizedProfit"))+t._s(t.$t("unrealized_pnl"))+" ")]),e("th",{on:{click:function(e){return t.change_sortkey("pnl_return")}}},[t._v(" "+t._s(t.sorted_icon("pnl_return"))+t._s(t.$t("pnl_return"))+" ")])]),t._l(t.sorted,(function(s){return e("tr",{key:s.symbol},[e("td",[t._v(t._s(s.symbol))]),e("td",[t._v(t._s(t._f("toPrecision")(s.markPrice,5)))]),e("td",[t._v(t._s(t._f("Number")(s.initial_size,0)))]),e("td",{class:t.color(s.unRealizedProfit)},[t._v(t._s(t._f("Number")(s.unRealizedProfit,1)))]),e("td",{class:t.color(s.unRealizedProfit)},[t._v(t._s(t._f("Precentage")(s.pnl_return,1)))])])}))],2)])},U=[],W=s("6bd8"),K=s.n(W),Y={name:"PositionView",props:{positions:Array},components:{ExportTable:R},data(){return{keywords:"",sort_key:"unRealizedProfit",sort_order:!0}},filters:$,computed:{sorted(){return f()(this.positions.map(t=>{const e=Math.abs(t.notional-t.unRealizedProfit);return{...t,initial_size:e,pnl_return:t.unRealizedProfit/e}}).filter(t=>0===this.keywords.length||t.symbol.includes(this.keywords.toUpperCase())),this.sort_key,this.sort_order?"desc":"asc")},unrealized(){return K()(this.positions,"unRealizedProfit")},total_initial_size(){return h()(this.positions.map(t=>Math.abs(t.notional-t.unRealizedProfit)))},total_posiion_size(){return h()(this.positions.map(t=>Math.abs(t.notional)))}},methods:{...O,sorted_icon(t){return t!==this.sort_key?"":this.sort_order?"↓":"↑"},change_sortkey(t){t===this.sort_key?this.sort_order=!this.sort_order:this.sort_key=t}},mounted(){}},q=Y,X=(s("e1c9"),Object(y["a"])(q,J,U,!1,null,"443413b7",null)),G=X.exports,H=function(){var t=this,e=t._self._c;return t.is_setting_mode?e("div",{staticClass:"modal",on:{click:function(e){return t.click("is_setting_mode")}}},[e("div",{staticClass:"modal-content",on:{click:t=>{t.stopImmediatePropagation()}}},[t._l(t.settingSwitchs,(function(s,a){return e("div",{key:a,staticClass:"setting-list"},[e("label",{staticClass:"switch"},[e("input",{attrs:{type:"checkbox"},domProps:{checked:t.getSettingValue(s.key)},on:{click:function(e){return t.click(s.key)}}}),e("span",{staticClass:"slider round"})]),e("span",[t._v(t._s(t.$t(s.label)))])])})),e("hr"),t._l(t.settingOptions,(function(s,a){return e("div",{key:a,staticClass:"setting-list"},[e("div",[t._v(t._s(t.$t(a))+":")]),t._l(s,(function(s){return e("button",{key:s.value,class:{"button-active":t.getSettingValue(a)===s.value},on:{click:function(e){return t.change_keyvalue(a,s.value)}}},[t._v(" "+t._s(s.label)+" ")])}))],2)})),e("div",{attrs:{id:"app-version"}},[t._v("app version: "+t._s(t.version))])],2)]):t._e()},Q=[],Z=s("9224"),tt={name:"Setting",components:{},props:{is_setting_mode:Boolean,is_hide_small_balance:Boolean,is_dark_mode:Boolean,is_perfer_return:Boolean,is_merge_wallets:Boolean,is_show_nav_title:Boolean,language:String,timeframe:String,asset_type:String},data(){return{version:Z["a"],settingSwitchs:[{key:"is_dark_mode",value:this.is_dark_mode,label:"dark_mode"},{key:"is_hide_small_balance",value:this.is_hide_small_balance,label:"hide_small_balance"},{key:"is_perfer_return",value:this.is_perfer_return,label:"show_return_in_small_device"},{key:"is_merge_wallets",value:this.is_merge_wallets,label:"is_merge_wallets"},{key:"is_show_nav_title",value:this.is_show_nav_title,label:"is_show_nav_title"}],settingOptions:{language:[{value:"en",label:"English"},{value:"zh",label:"Chinese"},{value:"jp",label:"Japanese"}],timeframe:[{value:"1d",label:"1d"},{value:"4d",label:"4d"},{value:"7d",label:"7d"},{value:"30d",label:"30d"}],asset_type:[{value:"all",label:"all"},{value:"crypto",label:"crypto"},{value:"stocks",label:"stocks"}]}}},methods:{getSettingValue(t){return this[t]},click(t){this.$emit("update:"+t,!this[t])},change_keyvalue(t,e){this.$emit("update:"+t,e)}}},et=tt,st=(s("13ad"),Object(y["a"])(et,H,Q,!1,null,"3f81f42c",null)),at=st.exports,it=function(){var t=this,e=t._self._c;return e("span",[t._v(t._s(t.$t("update_time"))+": "+t._s(t.lastUpdate))])},nt=[],ot=s("5a0c"),rt=s.n(ot);rt()().format();var lt={name:"Timer",props:{time:Number},data(){return{now:Date.now()}},computed:{lastUpdate(){const t=(rt()(this.now)-rt()(this.time))/1e3;return`${t.toFixed(0)} ${this.$i18n.t("sec_ago")}`}},created:function(){setInterval(()=>{this.now=Date.now()},1e3)}},_t=lt,ct=Object(y["a"])(_t,it,nt,!1,null,null,null),dt=ct.exports,ut=s("c707"),pt=s.n(ut),ht=s("589b"),mt=s("31cb"),ft=s("0829");Object(ht["f"])(c["a"]),Object(mt["a"])();const vt=Object(ft["c"])();var gt={name:"Main",components:{PieChart:k,AccountValue:B,PositionView:G,Setting:at,Timer:dt},props:{},data(){return{time:0,reported_total_cost:0,assets:[],positions:[],assets_table:[],price_map:{},price_history:[],userdata:{},daily_nav:[],saved:!1,screen_width:0,is_setting_mode:!1,is_exchange_chart:!1,is_nav_mode:!1,is_position_mode:!1,is_hide_small_balance:"true"===localStorage.is_hide_small_balance,is_dark_mode:"true"===localStorage.is_dark_mode,is_perfer_return:"true"===localStorage.is_perfer_return,is_merge_wallets:"true"===localStorage.is_merge_wallets,is_show_nav_title:"true"===localStorage.is_show_nav_title,language:localStorage.language||"en",timeframe:localStorage.timeframe||"1d",asset_type:localStorage.asset_type||"crypto",sort_key:"notional_value",sort_order:1}},computed:{title(){return this.is_show_nav_title?"$"+this.$options.filters.Number(this.nav,0):this.id.split(".")[0]+"'s Portfolio"},id(){const t=new Proxy(new URLSearchParams(window.location.search),{get:(t,e)=>t.get(e)});return{"x.ssarcandy.tw":"y.ssarcandy.tw","y.ssarcandy.tw":"x.ssarcandy.tw"}[t.id]||t.id},small_balance_threshold(){return.001*this.nav},nav(){return h()(this.assets_table.map(t=>t.size*t.price))},estimate_total_cost(){const t=h()(this.assets_table.map(t=>t.size*t.entry));return Math.max(t,this.reported_total_cost)},chart_data(){return this.is_exchange_chart?Object.values(this.assets_table.reduce((t,{wallet:e,notional_value:s})=>(t[e]={name:e,value:(t[e]?t[e].value:0)+s},t),{})):this.is_merge_wallets?Object.values(this.assets_table.reduce((t,{asset:e,notional_value:s})=>(t[e]={name:e,value:(t[e]?t[e].value:0)+s},t),{})):this.assets_table.map(t=>({name:t.asset,value:t.notional_value}))}},filters:$,methods:{...O,async save(){const t=Object(ft["a"])(vt,"config/"+this.id);await Object(ft["e"])(t,this.userdata),this.saved=!0,setTimeout(()=>{this.saved=!1},5e3)},pnl(t){const{asset:e,size:s,wallet:a}=t;return this.entry_p(e,a)&&this.price_map[e]?s*(this.price_map[e]-this.entry_p(e,a)):0},pnl_return(t){const{asset:e,wallet:s}=t;return this.entry_p(e,s)&&this.price_map[e]?this.price_map[e]/this.entry_p(e,s)-1:0},sum_pnl(t){return h()(t.map(({asset:t,size:e,price:s,wallet:a})=>this.entry_p(t,a)?e*(s-this.entry_p(t,a)):0))},today_pnl(){return this.daily_nav.length<2?0:this.nav-this.daily_nav[this.daily_nav.length-2][1]},tagcolor(t){const e=["#4059FB","#FF0000","#00EE00","#F1F605","#0EE5E4","#E65CA8","#757673","#F99700"];return{backgroundColor:e[t]}},should_show(t){return this.screen_width>500||(this.is_perfer_return?"pnl_return"===t:"pnl"===t)},sorted_icon(t){return t!==this.sort_key||2===this.sort_order?"":1===this.sort_order?"↓":"↑"},change_sortkey(t){t===this.sort_key?this.sort_order=(this.sort_order+1)%2:this.sort_key=t,this.update_assets_table()},change_tag(t){this.sort_order=2,void 0!==this.userdata[t]?(this.userdata[t]=(this.userdata[t]+1)%9,8==this.userdata[t]&&delete this.userdata[t]):this.$set(this.userdata,t,0)},assets_chages(t){if(0===this.price_history.length)return NaN;const e=parseInt(this.timeframe)+1,s=this.price_history.slice(-e)[0];return(this.price_map[t]-s[t])/s[t]},update_assets_table(){const t=this.assets.map(t=>({...t,tag:this.userdata[this.symbol_key(t.asset,t.wallet,"tag")],price:this.price_map[t.asset],price_changes:this.assets_chages(t.asset),notional_value:this.price_map[t.asset]*t.size,entry:this.entry_p(t.asset,t.wallet),pnl:this.pnl(t),pnl_return:this.pnl_return(t)})).filter(t=>"all"===this.asset_type||("stocks"===this.asset_type?"firstrade"===t.wallet:"firstrade"!==t.wallet));this.assets_table=f()(t,this.sort_key,1===this.sort_order?"desc":"asc"),document.title=this.title},symbol_key(t,e,s){return"binance"!==e?`${t}-${e}-${s}`:`${t}-${s}`},entry_k(t,e){return"binance"!==e?`${t}-${e}`:""+t},entry_p(t,e){const s="binance"!==e?`${t}-${e}`:""+t;return this.userdata[s]||0},async loadData(){const t=Object(ft["a"])(vt,"config/"+this.id),e=Object(ft["a"])(vt,"nav/"+this.id),[s,a]=await Promise.all([Object(ft["b"])(t),Object(ft["b"])(e)]);s.exists()&&(this.userdata=s.data()),a.exists()&&(this.daily_nav=pt()(Object.entries(a.data()),t=>t[0])),this.update_assets_table()},subscribeToAssetChanges(){const t=Object(ft["a"])(vt,"asset/"+this.id);Object(ft["d"])(t,t=>{if(!t.exists())return;const{time:e,data:s,positions:a,estimate_total_cost:i}=t.data();this.time=e,this.reported_total_cost=i,this.assets=s,this.positions=a,this.update_assets_table()})},subscribeToPriceChanges(){const t=Object(ft["a"])(vt,"price/snapshots");Object(ft["d"])(t,t=>{if(!t.exists())return;const e=t.data();this.price_history=pt()(Object.entries(e),t=>t[0]).map(t=>t[1]),this.price_map=this.price_history.slice(-1)[0],this.update_assets_table()})}},watch:{is_dark_mode:function(t){localStorage.is_dark_mode=t,document.documentElement.setAttribute("data-theme",t?"dark":"light")},is_hide_small_balance:function(t){localStorage.is_hide_small_balance=t},is_perfer_return:function(t){localStorage.is_perfer_return=t},is_merge_wallets:function(t){localStorage.is_merge_wallets=t},is_show_nav_title:function(t){localStorage.is_show_nav_title=t,document.title=this.title},language:function(t){localStorage.language=t,this.$i18n.locale=t},timeframe:async function(t){localStorage.timeframe=t,await this.loadData()},asset_type:function(t){localStorage.asset_type=t,this.update_assets_table()}},mounted(){this.screen_width=window.innerWidth>0?window.innerWidth:screen.width,document.documentElement.setAttribute("data-theme",this.is_dark_mode?"dark":"light")},created:async function(){this.$i18n.locale=this.language;try{await this.loadData(),this.subscribeToAssetChanges(),this.subscribeToPriceChanges()}catch(t){console.error("Error in created hook:",t)}}},bt=gt,yt=(s("ccb4"),Object(y["a"])(bt,l,_,!1,null,null,null)),wt=yt.exports,kt={name:"App",components:{Main:wt}},xt=kt,zt=Object(y["a"])(xt,o,r,!1,null,null,null),St=zt.exports,Pt=s("9483");Object(Pt["a"])("/crypto-portfolio/service-worker.js",{ready(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered(){console.log("Service worker has been registered.")},cached(){console.log("Content has been cached for offline use.")},updatefound(){console.log("New content is downloading.")},updated(){console.log("New content is available; please refresh."),window.location.reload()},offline(){console.log("No internet connection found. App is running in offline mode.")},error(t){console.error("Error during service worker registration:",t)}}),a["default"].use(i["a"]),a["default"].use(n["a"]);const $t={en:s("e088"),zh:s("8066"),jp:s("3146")},Ot=new i["a"]({locale:"en",messages:$t});new a["default"]({i18n:Ot,render:t=>t(St)}).$mount("#app")},"5d18":function(t,e,s){"use strict";s("7353")},7353:function(t,e,s){},8066:function(t){t.exports=JSON.parse('{"switch_chart":"切換圓餅圖視角","tag":"組","asset":"資產","wallet":"錢包","size":"量","price":"價","price_changes":"漲跌率","notional_value":"現值","entry":"入場價","pnl":"損益","pnl_return":"損益率","note":"備註","total_unrealized_pnl":"總未實現損益","today_pnl":"今日損益","today_pnl_error_msg":"今日損益只在顯示所有資產時有效","update_time":"更新時間","save":"儲存","saved":"已儲存！","sec_ago":"秒前","date":"日期","nav":"總資產","nav_page":"總資產走勢","diff":"日增減","estimate_total_cost":"預估總成本","export_as_csv":"匯出 CSV","7d":"7 日","30d":"30 日","90d":"90 日","180d":"180 日","365d":"365 日","all":"全歷史","positions_count":"持倉數量","symbol":"標的","position_notional":"價值","mark_price":"標記價格","initial_size":"初始價值","unrealized_pnl":"盈虧","total_initial_size":"總初始價值","total_position_size":"總價值","dark_mode":"深色模式","hide_small_balance":"隱藏小額資產 (小於 0.1% 總資產)","show_return_in_small_device":"在小螢幕裝置上顯示損益率","is_merge_wallets":"在圓餅圖顯示總和幣種資產","is_show_nav_title":"在網頁標題顯示總資產","language":"切換語言","timeframe":"價格變化率使用時框","asset_type":"顯示的資產類型"}')},9224:function(t){t.exports=JSON.parse('{"a":"1.5.2"}')},be6f:function(t){t.exports=JSON.parse('{"a":{"apiKey":"AIzaSyAiOeRX2NENGgKbW0VVQ4xR0gbPuyKJ5Ks","authDomain":"binance-portfolio-153c4.firebaseapp.com","projectId":"binance-portfolio-153c4","storageBucket":"binance-portfolio-153c4.appspot.com","messagingSenderId":"694089558371","appId":"1:694089558371:web:4e512f91c263ca77ad4b56","measurementId":"G-VT35JJGKW4"}}')},c392:function(t,e,s){},ccb4:function(t,e,s){"use strict";s("28a1")},e088:function(t){t.exports=JSON.parse('{"switch_chart":"Switch Chart View","tag":"Tag","asset":"Token","wallet":"Wallet","size":"Size","price":"Price","price_changes":"Chg%","notional_value":"Value","entry":"Entry","pnl":"PnL","pnl_return":"Return","note":"Note","total_unrealized_pnl":"Total Unrealized PnL","today_pnl":"Today PnL","today_pnl_error_msg":"PnL only valid when showing all asset type","update_time":"Update Time","save":"Save","saved":"Done !","sec_ago":"sec ago","date":"Date","nav":"Net Account Value","nav_page":"Net Account Value","diff":"Daily PnL","estimate_total_cost":"Estimated Total Cost","export_as_csv":"Export as CSV","7d":"7d","30d":"30d","90d":"90d","180d":"180d","365d":"365d","all":"ALL","positions_count":"Number of Positions","symbol":"Symbol","position_notional":"Value","mark_price":"Mark Price","initial_size":"Initial Size","unrealized_pnl":"PnL","total_initial_size":"Total Initial Size","total_position_size":"Total Position Size","dark_mode":"Dark Mode","hide_small_balance":"Hide Small Balance (less than 0.1% NAV)","show_return_in_small_device":"Show Return(%) in Small Device","is_merge_wallets":"Merge Same Coins in Wallets in Pie Chart","is_show_nav_title":"Show NAV on tab title","language":"Change language","timeframe":"Time-frame used for price changes","asset_type":"Asset type to show"}')},e1c9:function(t,e,s){"use strict";s("0a3b")}});