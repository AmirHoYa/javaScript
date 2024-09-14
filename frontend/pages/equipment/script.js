const header = document.getElementsByTagName("header")[0];
var isHeaderSmall = false;

window.onscroll = function() {resizeHeaderCheck()};

function resizeHeaderCheck() {
  if ((document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) && !isHeaderSmall) {
    smallHeader();
    isHeaderSmall = true;
  } else if (!(document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) && isHeaderSmall) {
    bigHeader();
    isHeaderSmall = false;
  }
} 

function bigHeader() {

}

function smallHeader() {

}