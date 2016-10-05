var transcript = {
    final: '',
    beta: '',
    alpha: ''
}

var elements = {
    final: document.querySelector('[data-transcript-final]'),
    beta: document.querySelector('[data-transcript-beta]'),
    alpha: document.querySelector('[data-transcript-alpha]')
};

var textNodes = {
    final: document.createTextNode(''),
    beta: document.createTextNode(''),
    alpha: document.createTextNode('')
};

elements.final.appendChild(textNodes.final);
elements.beta.appendChild(textNodes.beta);
elements.alpha.appendChild(textNodes.alpha);

var ws = new WebSocket('wss://10.113.193.100:8443')

ws.onerror = function(e) {
	console.log(e);
}

ws.onmessage = function(m) {

	var isScrolledToBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight;

    var results = JSON.parse(m.data).results;
    if (results.length) {
        transcript.alpha = '';
        transcript.beta = '';
        if (results[0].isFinal) {
//            transcript.final += ' (' + results[0].confidence.toFixed(1) + ')… ' + results[0].transcript;
            transcript.final += results[0].transcript + '… ';
            textNodes.beta.nodeValue = '';
            textNodes.alpha.nodeValue = '';
//            textNodes.final.nodeValue += ' (' + results[0].confidence + ') … ' + results[0].transcript;
            textNodes.final.nodeValue += results[0].transcript + '… ';
        } else {
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                if (result.stability > 0.5) {
                    transcript.beta = result.transcript;
                } else {
                    transcript.alpha = result.transcript;
                }
            }
            if (textNodes.beta.nodeValue.length !== transcript.beta.length) {
                textNodes.beta.nodeValue += transcript.beta.substr(textNodes.beta.nodeValue.length);
            }
            if (textNodes.alpha.nodeValue !== transcript.alpha) {
                textNodes.alpha.nodeValue = transcript.alpha;
            }
        }
        if (isScrolledToBottom) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }

};
