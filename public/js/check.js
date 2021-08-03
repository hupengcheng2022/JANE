function checkUsername(element) {
    var name=element.value;
    var span = document.getElementById("username");
    if (name.length==0){
        span.innerHTML = "<font color='red' size='2'>用户名不能为空</font>";
        document.getElementById("submit1").disabled = true;
    }else {
        if (name.indexOf(" ") == -1) {
            if (name.length < 2) {
                span.innerHTML = "<font color='red' size='2'>用户名太短</font>";
                document.getElementById("submit1").disabled = true;
            } else if (name.length > 6) {
                span.innerHTML = "<font color='red' size='2'>用户名太长</font>";
                document.getElementById("submit1").disabled = true;
            } else {
                span.innerHTML = "<font color='red' size='2'></font>";
                document.getElementById("submit1").disabled = false;
            }
        } else {
            span.innerHTML = "<font color='red' size='2'>用户名不能有空格</font>";
            document.getElementById("submit1").disabled = true;
        }
    }
}
function checkUsername1(element) {
    var name=element.value;
    var span = document.getElementById("username1");
    if (name.length==0){
        span.innerHTML = "<font color='red' size='2'>用户名不能为空</font>";
        document.getElementById("submit2").disabled = true;
    }else {
        if (name.indexOf(" ") == -1) {
            if (name.length < 2) {
                span.innerHTML = "<font color='red' size='2'>用户名太短</font>";
                document.getElementById("submit2").disabled = true;
            } else if (name.length > 6) {
                span.innerHTML = "<font color='red' size='2'>用户名太长</font>";
                document.getElementById("submit2").disabled = true;
            } else {
                span.innerHTML = "<font color='green' size='2'></font>";
                document.getElementById("submit2").disabled = false;
            }
        } else {
            span.innerHTML = "<font color='red' size='2'>用户名不能有空格</font>";
            document.getElementById("submit2").disabled = true;
        }
    }
}
function checkPassword() {
    var password=document.getElementById("password3").value;
    var span = document.getElementById("password1");
    if(password.length==0){
        span.innerHTML = "<font color='red' size='2'>密码不能为空</font>";
        document.getElementById("submit2").disabled = true;
    }else {
        if (password.indexOf(" ") == -1) {
            var regu = "^[0-9a-zA-Z]+$";
            var re = new RegExp(regu);
            if (re.test(password)) {
                if (password.length < 6) {
                    span.innerHTML = "<font color='red' size='2'>密码太短</font>";
                    document.getElementById("submit2").disabled = true;
                } else if (password.length > 12) {
                    span.innerHTML = "<font color='red' size='2'>密码太长</font>";
                    document.getElementById("submit2").disabled = true;
                } else {
                    span.innerHTML = "<font color='red' size='2'></font>";
                    document.getElementById("submit2").disabled = false;
                }
            } else {
                span.innerHTML = "<font color='red' size='2'>密码只能由字母、数字组成</font>";
                document.getElementById("submit2").disabled = true;
            }
        } else {
            span.innerHTML = "<font color='red' size='2'>密码不能有空格</font>";
            document.getElementById("submit2").disabled = true;
        }
    }
}
function checkPassword1() {
    var password=document.getElementById("password3").value;
    var password1=document.getElementById("password4").value;
    var span = document.getElementById("password2");
    if(password.length==0){
        span.innerHTML = "<font color='red' size='2'>密码不能为空</font>";
        document.getElementById("submit2").disabled = true;
    }else {
        if (password == password1) {
            span.innerHTML = "<font color='green' size='2'>密码一致</font>";
            document.getElementById("submit2").disabled = false;
        } else {
            span.innerHTML = "<font color='red' size='2'>密码不一致</font>";
            document.getElementById("submit2").disabled = true;
        }
    }
}