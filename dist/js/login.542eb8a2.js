(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["login"],{"9fea":function(t,a,s){"use strict";s("d201")},a55b:function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"about"},[s("div",{staticClass:"container"},[s("div",{staticClass:"row"},[s("div",{staticClass:"col-sm"}),s("div",{staticClass:"col-sm"},[s("form",{attrs:{autocomplete:"off"}},[s("div",{staticClass:"form-group"},[s("label",{attrs:{for:"exampleInputEmail1"}},[t._v("Email address")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.username,expression:"username"}],staticClass:"form-control",attrs:{type:"email",id:"exampleInputEmail1","aria-describedby":"emailHelp",placeholder:"Enter email"},domProps:{value:t.username},on:{input:function(a){a.target.composing||(t.username=a.target.value)}}}),s("small",{staticClass:"form-text text-muted",attrs:{id:"emailHelp"}},[t._v("We'll never share your email with anyone else.")])]),s("div",{staticClass:"form-group"},[s("label",{attrs:{for:"exampleInputPassword1"}},[t._v("Password")]),s("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],staticClass:"form-control",attrs:{type:"password",id:"exampleInputPassword1",placeholder:"Password"},domProps:{value:t.password},on:{input:function(a){a.target.composing||(t.password=a.target.value)}}})]),s("button",{staticClass:"btn btn-primary",attrs:{type:"button",ref_testcafe:"loginButton"},on:{click:function(a){return t.login()}}},[t._v(" Submit ")])])]),s("div",{staticClass:"col-sm"})])])])},o=[],n=s("dc59"),r={name:"LoginComponent",data:function(){return{username:"",password:""}},methods:{login:function(){n["b"].auth().signInWithEmailAndPassword(this.username,this.password)["catch"]((function(t){alert(t)}))}}},i=r,l=(s("9fea"),s("2877")),c=Object(l["a"])(i,e,o,!1,null,"71c2a109",null);a["default"]=c.exports},d201:function(t,a,s){}}]);
//# sourceMappingURL=login.542eb8a2.js.map