/** inicializar serviceWorker */
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/production/wspage.js', { scope:"/production/" })
	.then(function(registration) {
		// sucess :)
	}, function(err) {
		// registration failed :(
	});
}

window.onload = function(){
    const doc = document;

    async function post(url = '', data = {}) {
        const response = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
             'Content-Type': 'application/x-www-form-urlencoded'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer', 
          body: new URLSearchParams(data)
        });
        return response.json();
    }

    var submit = function(event){
        event.preventDefault();
        var progress = document.querySelector( ".progress-login" ), 
        t = this, error, arr = ((t)=>{
            var response = {};
            t.querySelectorAll("input")
            .forEach(element => {
                if( element.value == "" )
                    !error ? error = [element] : error.push(element);
                response[element.name] = element.value;
            });
            return response;
        })(t);

        progress.classList.add( "progress-login-focus" );

        if( ( !error ? 0 : error.length ) > 0 )
            return (()=>{
                progress.classList.remove( "progress-login-focus" );
                error[0].focus();
            })();
        post(t.action, arr)
        .then(response => {
            if( response.erro )
                return ( erro =>{
                    doc.querySelectorAll(".error-l")
                    .forEach(ele =>{
                        ele.classList.remove( "error-l" );
                    });

                var errorFocus = (name)=>{
                    let input = doc.querySelector("[name="+name+"]");
                    input.classList.add("error-l");
                    input.focus();
                    progress.classList.remove( "progress-login-focus" );
                };
                   switch(erro){
                       case 400:
                            errorFocus("login");
                        break;
                        case 401:
                            errorFocus("password");
                        break;
                   }
                })( parseInt( response.erro ) );

                /** iniciar service worker */
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/production/wspage.js', { scope: "/production/" }).then(function(registration) {
                      registration.unregister().then(function(boolean) {
                        caches.delete("essca").then(function() {
                            localStorage.setItem("responseUSER", response.sucess[0]);
                            document.location.href = "";
                        });
                      });
                    }).catch(function(error) {
                       alert('Registration failed with ' + error);
                    });
                }
        });
    };

    doc.querySelector("form")
    .addEventListener("submit", submit, true);
};