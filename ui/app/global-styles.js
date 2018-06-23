import quotes from 'img/quotes.svg';
import botTraining from 'img/bot-training.svg';
import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  body {
    font-family: 'Montserrat', sans-serif;
    font-size: 1em;
    line-height: 1em;
    color: #4e4e4e; }

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box; }

  .wrapper {
    margin: 0 auto;
    min-width: 800px;
    width: 85%; }

  a {
    color: #4e4e4e; }

  main {
    margin-left: 200px;
    width: calc(100% - 500px);
    float: left;
    padding-bottom: 100px; }
    main div section {
      width: calc(100% - 500px);
      height: auto;
      float: left; }

  h1 {
    font-size: 1.5em;
    font-weight: 700;
    margin: 0; }

  p {
    font-size: 1em;
    font-weight: 400;
    margin: 0;
    line-height: 1.3em; }

  td, th {
    padding: 15px 15px; }

  th {
    font-weight: 700; }

  th {
    font-weight: 300; }

  .container {
    width: 90%;
    margin-bottom: 90px;
  }

  .content-area {
    height: calc( 100vh - 70px );
    position: fixed;
    top: 70px;
    overflow-y: auto; }

  .row {
    margin-bottom: 0; }

  .group:after {
    visibility: hidden;
    display: block;
    content: "";
    clear: both;
    height: 0; }

  * html .group {
    zoom: 1; }

  /* IE6 */
  *:first-child + html .group {
    zoom: 1; }

  /* IE7 */
  #side-nav #logo > img {
    width: 95%;
    padding: 20px 0px 15px 13px;
  }

  #side-nav {
    float: left;
    position: fixed;
    width: 200px;
    height: 100vh;
    background: #00b4cb;
    /* Old browsers */
    background: -moz-linear-gradient(-45deg, #00b4cb 0%, #00ca9f 100%);
    /* FF3.6-15 */
    background: -webkit-linear-gradient(-45deg, #00b4cb 0%, #00ca9f 100%);
    /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #00b4cb 0%, #00ca9f 100%);
    /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00b4cb', endColorstr='#00ca9f',GradientType=1 );
    /* IE6-9 fallback */ }

  #side-nav ul > li {
    width: 100%;
    line-height: 35px;
    float: none;
  }

  nav {
    background-color: inherit;
    height: auto;
    box-shadow: none; }

  #side-nav .btn-agent {
    width: 80%;
    margin: 10px auto 10px auto; }
    #side-nav .btn-agent a {
      padding: 0;
      margin-left: 0 auto;
      background-color: #4ecbce;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      -ms-border-radius: 3px;
      border-radius: 3px;
      padding-top: 15px;
      padding-bottom: 15px;
      text-align: center; }
      #side-nav .btn-agent a:hover {
        background-color: rgba(0, 0, 0, 0.1); }

  .wrapper-nav {
    width: 90%;
    margin: 0 auto; }

  #side-nav ul a {
    font-weight: 300;
    font-size: 1em;
    color: #fff;
    padding: 15px 28px; }
    #side-nav ul a span {
      vertical-align: middle;
      color: #fff; }

  #side-nav img {
    width: 25px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px; }

  #side-nav .divider {
    margin: 0;
    padding: 0;
    border-color: #b4dbdb; }

  .bottom-nav {
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  #side-nav .bottom-nav p {
    font-weight: 300;
		font-size: 12px;
		line-height: 1.4em;
		padding: 0px 21px 10px;
  }

  #side-nav .bottom-nav a {
    font-weight: 600;
		display: inline;
		padding: 0;
  }

  #side-nav .bottom-nav a:hover {
    text-decoration: underline;
    background-color: inherit;
  }

  .settings-link {
    font-weight: 300;
    font-size: 1em;
    color: #fff;
    padding: 15px 28px;
    cursor: pointer; }
    .settings-link:hover {
      background-color: rgba(0, 0, 0, 0.1); }

  #side-nav .settings-link ul.sublinks {
    display: none;
    margin: 10px 0; }
    #side-nav .settings-link ul.sublinks li {
      opacity: 0;
      transform: translateX(-20px);
      transition: all 0.3s ease-in-out; }
      #side-nav .settings-link ul.sublinks li a {
        padding: 0;
        opacity: 0.7;
        transition: opacity 0.2s ease-out; }
        #side-nav .settings-link ul.sublinks li a:hover {
          opacity: 1;
          background-color: transparent; }
      #side-nav .settings-link ul.sublinks li .active {
        opacity: 1; }
    #side-nav .settings-link ul.sublinks li.slide-in {
      opacity: 1;
      transform: translateX(0px); }

  main > div > header {
    width: 100%;
    height: 70px;
    border-bottom: 1px solid #c5cbd8; }
    main > div > header div {
      display: inline-block;
      padding: 10px; }

  header .breadcrumb {
    color: #4e4e4e;
    opacity: 0.5;
    font-weight: 300;
    font-size: 1em; }

    header .breadcrumb:before {
      color: #c5cbd8;
      font-size: 16px; }

  header a.breadcrumb, .breadcrumb:last-child {
    color: #4e4e4e;
    opacity: 1;
    font-weight: 400; }

  header a.breadcrumb:hover {
    text-decoration: underline;}

  .right-panel {
    top: 70px;
    width: 300px;
    height: 100vh;
    position: fixed;
    right: 0;
    border-left: 1px solid #c5cbd8;
    padding: 35px 20px 20px 20px;
  }

  .right-panel-header {
    width: 300px;
    height: 70px;
    position: fixed;
    right: 0;
    border-left: 1px solid #c5cbd8;
    border-bottom: 1px solid #c5cbd8;
  }

  .training-container {
    width: 100%;
    padding: 13px 15px;
  }

  .condition, .trained-timestamp {
    font-weight: 300;
  }

  .condition span, .trained-timestamp span {
      font-weight: 400;
  }

  a.activate-training {
    width: 100%;
    border-color: #eaeaea;
    background-color: #eaeaea !important;
    display: flex;
    justify-content: center; }
  a.activate-training:hover {
      color: #4e4e4e;
      border-color: #eaeaea;
      background-color: #eaeaea;
      cursor: default; }
  a.activate-training:before {
      display: inline-block;
      content: ' ';
      background-image: url(${botTraining});
      background-size: cover;
      background-repeat: no-repeat;
      height: 28px;
      width: 28px;
      margin-right: 8px; }

  .btn-small {
    padding: 0 20px;
    width: auto;
    display: inline-block;
    border: 1px solid #4e4e4e;
    background-color: white !important;
    color: #4e4e4e;
    box-shadow: none;
  }

  .btn-small:hover {
    background-color: white;
    color: #00ca9f;
    border-color: #00ca9f;
    box-shadow: none;
  }

  .conversation-panel {
    top: 70px;
    bottom: 80px;
    width: 300px;
    position: fixed;
    right: 0;}

  .main-title {

  }

  .main-title h1 {
    color: #00ca9f;
    margin-bottom: 20px;
  }

  .sub-title {
  }

  .sub-title h1 {
    font-size: 20px;
    color: #4e4e4e;
  }

  .btn-action {
    position: fixed;
    top: -4px;
    right: 330px;
  }

  .btn-edit-delete {
    position: fixed;
    top: 6px;
    right: 330px;
  }

  .btn-floating {
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    background-color: #00ca9f; }

  .btn-floating.btn-large {
    width: auto;
    height: auto;
    padding: 0 20px;
    text-transform: capitalize; }

  #form-section {
    margin: 20px 0 0;
    position: relative;
  }

  #form-section .input-field {
    padding: 0 1.5rem 0 0;
  }

  .input-icon {
    float: right;
    margin-top: -54px;
  }

  #form-section input {
    border: 1px solid #c5cbd8;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    padding-left: 15px;
    font-weight: 300;
    left: 0; }
  #form-section input:focus {
      border: 1px solid #00ca9f;
      -webkit-box-shadow: none;
      box-shadow: none; }

  .conversation-input {
    width: 215px !important;
    margin-bottom: 10px !important;
    margin-left: 11.25px !important;
  }

  .warning {
    top: -14px;
    position: relative;
    font-style: italic;
    color: #d7350b;
    font-weight: 300;
    font-size: 0.8em; }

  .input-field.col label {
    left: 0;
    -webkit-transform: translateY(-25px) scale(0.8);
    transform: translateY(-25px) scale(0.8); }

  label {
    font-size: 1.1em;
    color: #4e4e4e; }

  .input-field label {
    height: auto !important;
    font-size: 1.4em;
    color: #4e4e4e;
  }

  .typeahead-label{
    top: -10px !important;
    position: relative !important;
    font-size: 1.1em !important;
  }

  .tooltipped-input-label{
    top: -10px !important;
    position: relative !important;
    font-size: 1.1em !important;
  }

  .input-field label:not(.label-icon).active {
    -webkit-transform: translateY(-25px) scale(0.8);
    transform: translateY(-25px) scale(0.8); }

  input:not([type]):focus:not([readonly]) + label, input[type=text]:not(.browser-default):focus:not([readonly]) + label, input[type=password]:not(.browser-default):focus:not([readonly]) + label, input[type=email]:not(.browser-default):focus:not([readonly]) + label, input[type=url]:not(.browser-default):focus:not([readonly]) + label, input[type=time]:not(.browser-default):focus:not([readonly]) + label, input[type=date]:not(.browser-default):focus:not([readonly]) + label, input[type=datetime]:not(.browser-default):focus:not([readonly]) + label, input[type=datetime-local]:not(.browser-default):focus:not([readonly]) + label, input[type=tel]:not(.browser-default):focus:not([readonly]) + label, input[type=number]:not(.browser-default):focus:not([readonly]) + label, input[type=search]:not(.browser-default):focus:not([readonly]) + label, textarea.materialize-textarea:focus:not([readonly]) + label {
    color: #00ca9f; }

  input.valid:not([type]), input.valid:not([type]):focus, input[type=text].valid:not(.browser-default), input[type=text].valid:not(.browser-default):focus, input[type=password].valid:not(.browser-default), input[type=password].valid:not(.browser-default):focus, input[type=email].valid:not(.browser-default), input[type=email].valid:not(.browser-default):focus, input[type=url].valid:not(.browser-default), input[type=url].valid:not(.browser-default):focus, input[type=time].valid:not(.browser-default), input[type=time].valid:not(.browser-default):focus, input[type=date].valid:not(.browser-default), input[type=date].valid:not(.browser-default):focus, input[type=datetime].valid:not(.browser-default), input[type=datetime].valid:not(.browser-default):focus, input[type=datetime-local].valid:not(.browser-default), input[type=datetime-local].valid:not(.browser-default):focus, input[type=tel].valid:not(.browser-default), input[type=tel].valid:not(.browser-default):focus, input[type=number].valid:not(.browser-default), input[type=number].valid:not(.browser-default):focus, input[type=search].valid:not(.browser-default), input[type=search].valid:not(.browser-default):focus, textarea.materialize-textarea.valid, textarea.materialize-textarea.valid:focus, .select-wrapper.valid > input.select-dropdown {
    -webkit-box-shadow: none;
    box-shadow: none; }

  .select-wrapper + label {
    top: -9px; }

  .input-field {
    margin-top: 2.5rem;
  }

  .input-synonym {
    margin: 0 !important;
  }

  .dropdown-content li > a, .dropdown-content li > span {
    color: #4e4e4e;
    font-size: 1em; }

  .dropdown-content {
    box-shadow: none;
    border: 1px solid #00ca9f;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px; }

  .timezones {
    box-shadow: none;
    border: 1px solid #00ca9f;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
  }

  [type="radio"]:checked + label:after, [type="radio"].with-gap:checked + label:after {
    background-color: #00ca9f; }

  [type="checkbox"]:not(:checked), [type="checkbox"]:checked{
    pointer-events: fill !important;
  }

  [type="checkbox"].filled-in:not(:checked)+label:after{
    top: 12px;
    left: -2px;
  }

[type="checkbox"].filled-in:checked+label:after{
    top: 12px;
    left: -2px;
  }

[type="checkbox"].filled-in:checked+label:before{
    top: 12px;
    left: -1px;
  }

  .slot-checkboxs {
    bottom: 35px;
  }

  [type="radio"]:not(:checked) + label, [type="radio"]:checked + label {
    padding-left: 0; }

  [type="radio"]:checked + label:before, [type="radio"]:checked + label:after, [type="radio"]:not(:checked) + label:before, [type="radio"]:not(:checked) + label:after, [type="radio"]:not(:checked) + label:after {
    margin-top: 30px; }
  [type="checkbox"]:checked + label:before {
    border-right: 2px solid #3CDE5D;
    border-bottom: 2px solid #3CDE5D;
  }
  form p:last-child {
    margin-left: 40px;
    margin-top: 3px;
    font-weight: 300; }

  /*.checkbox-container {
    margin: 20px 0; }*/

  .table-container {
    margin: 0 0 20px 0;
    position: relative; }

  .table-container .input-field {
    padding: 0 1.5rem 0 0; }

  .table-col {
    padding-right: 5px !important;
    margin-top: 0px;
  }

  .table-delete-row {
    color: ##4e4e4e;
    float: right;
    font-size: 1.5rem;
  }

  .table-delete-row:hover {
    color: #00ca9f;
  }

  .mic-icon {
    padding-top: 10px;
    color: #4e4e4e !important;
    float: right;
    font-size: 1.5rem;
  }

  .mic-icon-recording {
    padding-top: 10px;
    color: #red !important;
    float: right;
    font-size: 1.5rem;
  }

  .mic-icon:hover {
    color: #00ca9f;
  }

  .edit-delete-icon {
    color: #4e4e4e !important;
    font-size: 16px !important;
    vertical-align: bottom;
  }

  .quotes:before, .quotes:after {
    display: block;
    content: ' ';
    background-image: url(${quotes});
    background-repeat: no-repeat;
    background-size: 25px 25px;
    height: 25px;
    width: 25px;
    position: absolute; }

  .quotes:before {
    left: -40px; }

  .quotes:after {
    -moz-transform: scale(-1, -1);
    -webkit-transform: scale(-1, -1);
    -o-transform: scale(-1, -1);
    transform: scale(-1, -1);
    right: -35px;
    bottom: 0px; }

  .border-container {
    border: 1px solid #c5cbd8;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px; }

  table.bordered {
    border: 1px solid #c5cbd8;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    overflow: hidden; }

  thead {
    line-height: 1.7em; }

  table.highlight > tbody > tr:hover {
    background: #f0f3f7; }

  table.highlight > tbody > tr > td:first-child {
    font-weight: 300; }

  /*[type="checkbox"].filled-in:checked + label:after {
    background-color: #00ca9f;
    border: 1px solid #00ca9f; }*/

  th .material-icons {
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
    font-size: 1.3em; }
    th .material-icons:hover {
      color: #00ca9f; }

  .backdrop {
    background-color: #4e4e4e; }

  .material-tooltip {
    max-width: 400px; }

  .thumb {
    margin: 0; }

  form p.range-field {
    margin-left: 0; }

  .chip .remove{
    cursor:pointer;
    float:right;
    font-size:16px;
    line-height:32px;
    padding-left:8px
  }

  .multiline-chip{
    height: auto !important;
  }

  .select-dropdown.dropdown-content li:hover {
    background-color: #f0f3f7; }

  .select-wrapper span.caret {
    color: #c5cbd8; }

  .dropdown-entity-selector {
    width: 300px !important;
    height: 400px !important;
    left: auto !important;
  }

  .dropdown-slot-entity-selector{
    width: 300px !important;
  }

  .modal-footer > button {
    margin: 6px !important;
  }

  .modal-footer{
    text-align: center !important;
  }

  .message-card{
    word-wrap: break-word;
  }

  .error-img {
    max-width: 500px;
  }

  .error-btn-container {
    margin: 30px 0;
  }

  .error-paragraph {
    max-width: 575px;
    margin: 0 auto;
  }

  .secondary-btn {
    background-color: #c4ccca; }
    .secondary-btn:hover {
      background-color: #adb2b1; }

  .pagination-bottom .-pagination {
    height: 45px;
  }

  .ReactTable .-pagination .-pageJump input {
    margin: 0px;
    height: 20px;
    width: 30px !important;
  }

  .ReactTable .-pagination .-center {
    justify-content: center !important;
  }

  .ReactTable .rt-noData {
    display: none !important;
  }
  .user-bubble, .bot-bubble {
    padding: 10px;
    min-width: 50px;
    border-radius: 3px;
    width: fit-content;
    margin-bottom: 35px;
    position:relative;

    p {
      font-weight: 300;
    }

  }

  .user-bubble, .bot-bubble {
    padding: 10px;
    min-width: 50px;
    border-radius: 3px;
    width: fit-content;
    margin-bottom: 35px;
    position: relative; }
    .user-bubble p, .bot-bubble p {
      font-weight: 300; }

  .user-bubble {
    background-color: #00ca9f;
    margin-left: 12px; }
    .user-bubble .bubble-container::before {
      content: "User";
      position: absolute;
      font-size: 12px;
      top: -20px;
      right: 30px;
      display: inline-block;
      width: 10px;
      height: 10px;
      color: #c4ccca; }
    .user-bubble p {
      color: white; }
    .user-bubble:before {
      content: "";
      position: absolute;
      bottom: -8px;
      right: 0px;
      width: 20px;
      height: 20px;
      background-color: #00ca9f;
      border-radius: 3px;
      transform: skewY(38deg);
      z-index: -1; }

  .bot-bubble {
    background-color: white;
    border: 1px solid #00ca9f;
    margin-right: 12px; }
    .bot-bubble .bubble-container::before {
      content: "Bot";
      position: absolute;
      font-size: 12px;
      top: -20px;
      display: inline-block;
      width: 10px;
      height: 10px;
      color: #c4ccca; }
    .bot-bubble p {
      color: #00ca9f; }
    .bot-bubble:before, .bot-bubble:after {
      content: "";
      position: absolute;
      border-radius: 3px; }
    .bot-bubble:before {
      bottom: -7px;
      left: -1px;
      width: 20px;
      height: 20px;
      border: 1px solid #00ca9f;
      transform: skewY(-38deg);
      z-index: -1; }
    .bot-bubble:after {
      bottom: -2px;
      left: 0px;
      width: 16px;
      height: 3px;
      background: white;
      border: 5px solid white;
      z-index: 1; }

  div#wave {
    position: relative;
    height: auto;
    border: 1px solid #00ca9f;
    border-radius: 3px;
    padding: 7px 10px; }
    div#wave .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00ca9f;
      animation: wave 1.3s linear infinite; }
      div#wave .dot:nth-child(2) {
        animation-delay: -1.1s; }
      div#wave .dot:nth-child(3) {
        animation-delay: -0.9s; }

  @keyframes wave {
    0%, 60%, 100% {
      transform: initial; }
    30% {
      opacity: 0.15; } }

  .disable-selection {
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer */
    -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
    -webkit-user-select: none; /* Chrome, Safari, and Opera */
    -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
   }

  .accordion_arrow_inverted::before {
    right: 4px;
    transform: rotate(45deg);
  }

  [aria-expanded='true'] .accordion_arrow_inverted::before, [aria-selected='true'] .accordion_arrow_inverted::before {
      transform: rotate(-45deg);
  }

  .accordion_arrow_inverted::after {
      left: 4px;
      transform: rotate(-45deg);
  }

  [aria-expanded='true'] .accordion_arrow_inverted::after, [aria-selected='true'] .accordion_arrow_inverted::after {
      transform: rotate(45deg);
  }

  .accordion_arrow_inverted::before,
  .accordion_arrow_inverted::after {
      transition: transform 0.25s ease, -webkit-transform 0.25s ease;
  }

  .accordion__title--animated:hover .accordion_arrow_inverted {
      animation-name: move-down;
      animation-duration: 1.5s;
  }

  .accordion__title--animated[aria-expanded='true']:hover .accordion_arrow_inverted {
      animation-name: move-up;
      animation-duration: 1.5s;
  }


  .accordion_arrow_inverted {
    display: inline-block;
    position: relative;
    width: 24px;
    height: 12px;
    top: 50%;
    right: 0;
    float: right;
    margin-top: 0px;
    position: relative;
  }

  .accordion_arrow_inverted::after,
  .accordion_arrow_inverted::before {
    display: block;
    position: absolute;
    top: 50%;
    width: 10px;
    height: 2px;
    background-color: currentColor;
    content: '';
  }

`;
