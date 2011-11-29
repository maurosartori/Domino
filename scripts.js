
	function gestisciCiclo(){
		voce_menu = $('#menu li');
		categorie = voce_menu.length;
		
		var atterraggio = GetUrlParam('categoria');//parametro per categorie con pochi coupon, che non hanno pagina dedicata ma restano in hp
		if(atterraggio!=''){//categoria resta fissa
			//voce_menu.filter('.no_link.'+atterraggio).children('a').trigger('click');
			voce_menu.filter('.'+atterraggio).addClass('on');//accendo voce menu relativa
			$('#sfondo').addClass(atterraggio);//inizializzo sfondo
			$('div.coupon_cat').hide().filter('.'+atterraggio).show().children('div.coupon').each(function(){//mostro solo coupon della categoria accesa
				var id_coupon = $(this).find('div.corredo a').attr('id').replace('id_','');//statistiche impression
				//console.log(id_coupon);
				statistiche('impression',id_coupon);
			});
			//console.log(voce_menu.filter('.no_link.'+atterraggio));
		} else {//comportamento normale, categorie scorrono
			var ora = new Date();
			ora = ora.getMilliseconds();//simulo un numero a caso
			//console.log(ora);
			indice = ora%categorie;//divido per il numero di categorie e prendo il resto della divisione, in modo da restare all'interno del numero di categorie
			//console.log(indice);
			var primo = voce_menu.eq(indice).attr('class').split(" ");//dato che ci possono essere + classi oltre la categoria, uso lo split
			$('#sfondo').addClass(primo[0]);//inizializzo sfondo
			voce_menu.eq(indice).addClass('on');//inizializzo voce accesa
			$('div.coupon_cat').hide().filter('.'+primo[0]).show().children('div.coupon').each(function(){//mostro solo coupon della categoria accesa
				var id_coupon = $(this).find('div.corredo a').attr('id').replace('id_','');//statistiche impression
				//console.log(id_coupon);
				statistiche('impression',id_coupon);
			});
			t=setInterval("ciclaCategorie()",10000);
		}
		
		//$("#menu li.no_link a").click(function(){//interrompo ciclo al click di no_link
		voce_menu.children('a').click(function(){//interrompo ciclo al click della voce di menu
			//console.log('clicco la prima a, non il figliolo');
			var liPadre = $(this).parent("li"),
				nome_citta = $("#attuale span").text(),
				nome_categoria = $(this).text(),
				attuale = liPadre.attr('class').split(" ");
			s=clearInterval(t);
			//console.log(nome_categoria);
			nome_categoria = encodeURI(nome_categoria);
			nome_categoria = nome_categoria.replace('&','e');
			//console.log(nome_categoria);
			$('#sfondo').animate({opacity:0},'slow',function(){
				voce_menu.removeClass('on');
				liPadre.addClass("on");
				$('div.coupon_cat').hide().filter('.'+attuale[0]).show().children('div.coupon').each(function(){//mostro solo coupon della categoria accesa
				var id_coupon = $(this).find('div.corredo a').attr('id').replace('id_','');//statistiche impression
				//console.log(id_coupon);
				statistiche('impression',id_coupon);
			});
				$(this).removeClass().addClass(attuale[0]).animate({opacity: 1},'slow');
			});
			var id_categoria = attuale[0].split('_')[1];
			//console.log(id_categoria);
			statistiche('categoria',id_categoria);
			
			_gaq.push(['_trackPageview', '/'+nome_citta+'/clic-'+nome_categoria+'/']);
			return false;
		});
	}

	function ciclaCategorie(){
		//console.log('indice prima di if: '+indice);
		indice++;
		if (indice==categorie) {indice=0}//rendo ciclo circolare
		var attuale = voce_menu.eq(indice).attr('class').split(" ");
		//console.log(attuale);
		//console.log('indice dopo if: '+indice+' con classe: '+attuale);
		$('#sfondo').animate({opacity:0},'slow',function(){
			voce_menu.removeClass('on').eq(indice).addClass('on');
			$('div.coupon_cat').hide().filter('.'+attuale[0]).show().children('div.coupon').each(function(){//mostro solo coupon della categoria accesa
				var id_coupon = $(this).find('div.corredo a').attr('id').replace('id_','');//statistiche impression
				//console.log(id_coupon);
				statistiche('impression',id_coupon);
			});
			$(this).removeClass().addClass(attuale[0]).animate({opacity: 1},'slow');
		});
	}

	function filtraSottocat(){
		$('#coupon_wrapper div.coupon:visible:even').addClass('dispari');//inizializzo elementi dispari per dare margine solo ai box di sx visibili
		var input_check = $('#filtra_content').find('input[type="checkbox"]');
		if (input_check.length ==1) {input_check.attr('disabled','disabled');}//all'inizio controllo se c'e' solo un checkbox ed eventualmente lo disabilito
		input_check.attr('checked','checked').change(function(){//all'inizio tutti hanno check
			var questo = $(this);
			var filtrati = $('div.coupon').filter( '.'+questo.val() )//memorizzo solo i coupon della sottocategoria identificata dal value del checkbox cliccato
			if ( questo.is(':checked') ) {
				filtrati.show();
			} else {
				filtrati.hide();
			}
			$('#coupon_wrapper div.coupon').removeClass('dispari');//resetto elementi dispari
			$('#coupon_wrapper div.coupon:visible:even').addClass('dispari');//aggiorno elementi dispari
			var attivi = $('#filtra_content').find('input[type="checkbox"]:checked');
			if ( attivi.length == 1 ) {//se ho solo un check attivo
				attivi.attr('disabled','disabled');//lo disabilito per evitare di nascondere anche gli ultimi coupon
			} else {
				attivi.removeAttr('disabled');//riattivo
			}
		});
	}

	function apriLayerCoupon(){
		var apre = $("div.corredo a, div.abstract"),
			body = $('body'),
			layer = $('<div id="layer"></div>'),
			contenitore = $('<div id="contenitore"></div>'),
			titolo = $('<div id="titolo"><h2>&nbsp;</h2><a href="#" class="chiudi" title="'+stampaMessaggi('layer','torna')+'">'+stampaMessaggi('layer','torna')+'</a></div>'),
			prodotto = $('<div id="prodotto"><ul id="azioni"><li><a href="#" title="'+stampaMessaggi('layer','salva')+'" id="salva"></a></li><li><a href="#" title="'+stampaMessaggi('layer','stampa')+'" id="stampa"></a></li><li><a href="#" title="'+stampaMessaggi('layer','zoomPiu')+'" id="zoomIn"></a></li><li><a href="#" title="'+stampaMessaggi('layer','zoomMeno')+'" id="zoomOut"></a></li><li><a href="#" class="mail_sms" title="'+stampaMessaggi('mail','invia')+'" rel="mail"></a></li><li><a href="#" class="mail_sms" title="'+stampaMessaggi('sms','invia')+'" rel="sms"></a></li></ul><div id="contenitore_img"><img src="" alt=""/></div></div>'),//versione con sms
			//prodotto = $('<div id="prodotto"><ul id="azioni"><li><a href="#" title="'+stampaMessaggi('layer','salva')+'" id="salva"></a></li><li><a href="#" title="'+stampaMessaggi('layer','stampa')+'" id="stampa"></a></li><li><a href="#" title="'+stampaMessaggi('layer','zoomPiu')+'" id="zoomIn"></a></li><li><a href="#" title="'+stampaMessaggi('layer','zoomMeno')+'" id="zoomOut"></a></li><li><a href="#" class="mail_sms" title="'+stampaMessaggi('mail','invia')+'" rel="mail"></a></li></ul><div id="contenitore_img"><img src="" alt=""/></div></div>'),//versione senza sms
			//fb = $('<div class="fb"><iframe src="#"></iframe></div>');
			fb = $('<div class="fb">&nbsp;</div>');
			
		apre.click(function(){
			var questo = $(this),
				scrollTop = $(window).scrollTop(),//memorizzo lo scrolling della finestra
				questo_link = questo.closest("div.coupon_content").find('.corredo > a'),
				categoria = questo.closest("div.coupon_cat").attr("class").split(" ")[1],
				nome_coupon = questo.closest("div.coupon_content").find("h2").text(),
				//nome_categoria = $("#menu li.on a").text(),
				nome_citta = $("#attuale span").text(),
				//id_stat = questo_link.attr('id').split('_')[1],//id coupon, per statistiche (tra l'altro)
				id_stat = questo_link.attr('id').replace('id_',''),//id coupon, per statistiche (tra l'altro)
				imgSrc = questo_link.attr("href"),
				url_fb = questo_link.attr("rel");//url necessaria a costruire il pulsante like e associarlo al coupon
			
			s=clearInterval(t);
			body.append(layer);
			layer.append(contenitore);
			titolo.find("h2").html(nome_coupon);//scrivo titolo del layer a seconda del titolo coupon
			contenitore.css('top',scrollTop+20).append(titolo).removeClass().addClass(categoria).append(prodotto);//costruisco i vari pezzi del layer
			//fb.find("iframe").attr({"src":"http://www.facebook.com/plugins/like.php?href="+url_fb+"&amp;layout=standard&amp;show_faces=false&amp;width=500&amp;action=like&amp;font=arial&amp;colorscheme=light&amp;height=27' scrolling='no' frameborder='0' style='border:none; overflow:hidden; width:450px; height:27px;' allowTransparency='true'"});
			chiudiLayer(layer);
			/* fb.find("iframe").attr({
				'scrolling':'no',
				'frameBorder':'0',//attenzione: frameBorder con la B maiuscola
				'src':'http://www.facebook.com/plugins/like.php?href'+url_fb+'&amp;send=false&amp;layout=standard&amp;width=800&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=37"',
				'style':'border:0 none; overflow:hidden; width:800px; height:37px;',
				'allowTransparency':'true'
			});//prima settare frameBorder a 0, solo dopo inserirlo nel dom (altrimenti non funge su IE) */
			prodotto.after(fb).find("#contenitore_img img").attr({"src":imgSrc});//inserisco la img grande a partire dalla thumbnail
			layer.height(getDocHeight());
			
			$('#layer div.fb').html('<div class="preclick"><a href="#" title="'+stampaMessaggi('layer','share')+'"><img src="'+percorso+'img/btn_share.png" alt="['+stampaMessaggi('layer','share')+']" /></a></div>');//versione con script nella head
			//$('#layer div.fb').html('&nbsp;');
			$('#layer div.preclick > a').live('click',function(){
				statistiche('social',id_stat);
				
				$('#layer div.fb').html('<!-- AddThis Button BEGIN --><div class="addthis_toolbox addthis_default_style " addthis:url="'+url_fb+'" addthis:title="'+titolo+'" ><a class="addthis_button_facebook_like" fb:like:layout="button_count"></a><a class="addthis_button_tweet"></a><a class="addthis_counter addthis_pill_style"></a></div><!-- AddThis Button END -->');//versione con script nella head
				addthis.init();
				addthis.toolbox(".addthis_toolbox");
				addthis.counter(".addthis_counter");
				return false;
			});
			
			azioni(prodotto, id_stat);//sono le azioni da compiere sul img
			inviaNotifiche('azioni',id_stat);//per inviare sms o email
			statistiche('layer',id_stat);
			
			_gaq.push(['_trackPageview', '/'+nome_citta+'/layer-coupon/']);
			return false;
		});
	}

	function apriLayerBanner(){
		var apre = $('#banner_wrapper a'),
			body = $('body'),
			layer = $('<div id="layer"></div>'),
			contenitore = $('<div id="contenitore"></div>'),
			titolo = $('<div id="titolo"><h2></h2><a href="#" class="chiudi" title="'+stampaMessaggi('layer','chiudi')+'">'+stampaMessaggi('layer','chiudi')+'</a></div>'),
			prodotto = $('<div id="prodotto"><ul id="azioni"><li><a href="#" title="'+stampaMessaggi('layer','salva')+'" id="salva"></a></li><li><a href="#" title="'+stampaMessaggi('layer','stampa')+'" id="stampa"></a></li><li><a href="#" title="'+stampaMessaggi('layer','zoomPiu')+'" id="zoomIn"></a></li><li><a href="#" title="'+stampaMessaggi('layer','zoomMeno')+'" id="zoomOut"></a></li></ul><div id="contenitore_img"><img src="" alt=""/></div></div>'),//versione senza mail sms
			//prodotto = $('<div id="prodotto"><ul id="azioni"><li><a href="#" title="'+stampaMessaggi('layer','salva')+'" id="salva"></a></li><li><a href="#" title="'+stampaMessaggi('layer','stampa')+'" id="stampa"></a></li><li><a href="#" title="'+stampaMessaggi('layer','zoomPiu')+'" id="zoomIn"></a></li><li><a href="#" title="'+stampaMessaggi('layer','zoomMeno')+'" id="zoomOut"></a></li><li><a href="#" class="mail_sms" title="'+stampaMessaggi('mail','invia')+'" rel="mail"></a></li><li><a href="#" class="mail_sms" title="'+stampaMessaggi('sms','invia')+'" rel="sms"></a></li></ul><div id="contenitore_img"><img src="" alt=""/></div></div>'),//versione con mail sms
			link_banner = $('<div class="link"><a href="#" target="_blank">&nbsp;</a></div>');
		apre.click(function(){
			var questo = $(this),
				scrollTop = $(window).scrollTop(),//memorizzo lo scrolling della finestra
				questo_link = questo.attr('href'),//link del banner
				questo_titolo = questo.attr('title'),//titolo del banner
				nome_citta = $("#attuale span").text(),
				//id_stat = questo.attr('id').split('_')[1],//id coupon, per statistiche (tra l'altro)
				id_stat = questo.attr('id').replace('id_',''),//id coupon, per statistiche (tra l'altro)
				imgSrc = questo.attr('rel');//immagine grande del banner
				//categoria = questo.closest("div.coupon_cat").attr("class").split(" ")[1],
				//nome_categoria = questo.closest("div.coupon_content").find("h2").text(),
				//url_fb = questo_link.attr("rel");//url necessaria a costruire il pulsante like e associarlo al coupon
			
			//console.log(questo_link);
			clearInterval(t);
			body.append(layer);
			layer.append(contenitore);
			//titolo.find("h2").html(nome_categoria);//scrivo titolo del layer a seconda del titolo coupon
			contenitore.css('top',scrollTop+20).append(titolo).append(prodotto);//costruisco i vari pezzi del layer
			prodotto.after(link_banner).find("#contenitore_img img").attr({"src":imgSrc});//inserisco la img grande a partire dalla thumbnail
			//console.log(link_banner.find('a').attr('href'));//.text(questo_link);
			titolo.find('h2').text(questo_titolo);
			link_banner.find('a').attr({'href':questo_link}).text(questo_link);
			layer.height(getDocHeight());
			chiudiLayer(layer);
			azioni(prodotto, id_stat);
			//inviaNotifiche('azioni',id_stat);//per inviare sms o email
			statistiche('layer',id_stat);
			
			_gaq.push(['_trackPageview', '/'+nome_citta+'/layer-coupon/']);
			return false;
		});
	}
	
	function chiudiLayer(layer){
		$("#layer a.chiudi").click(function(){
			layer.find("#contenitore_img img").attr({"src":"#"});
			//$("#zoomIn,#zoomOut").removeClass("disabilitato");
			layer.remove();
			//t=setInterval("ciclaCategorie()",10000);
			return false;
		});
		
		$("div.box_invia a.chiudi").click(function(){
			//layer.find("#contenitore_img img").attr({"src":"#"});
			layer.remove();
			//t=setInterval("ciclaCategorie()",10000);
			return false;
		});
	}

	function azioni(prodotto, id_stat){
		$("#salva").click(function(){//salva
			var url = $("#contenitore_img img").attr("src");
			if (id_stat!=null) {statistiche('salva',id_stat);}
			window.open(url);
			return false;
		});
		
		$("#stampa").click(function(){//stampa
			if (id_stat!=null) {statistiche('stampa',id_stat);}
			window.print();
			return false;
		});
		
		var t=setTimeout("confrontaAltezze()",1000);//zoom ritardato temporalmente per permettere lettura corretta altezza immagine
		//inviaNotifiche($("#azioni"),id_stat);
		//inviaNotifiche('azioni',id_stat);
	}

	function confrontaAltezze() {//per gestire zoom
		//alert('partenza!')
		$("#zoomIn,#zoomOut").removeClass("disabilitato");//resetto
		var img = $('#contenitore_img').find("img");
		img.removeAttr('style');//resetto
		var prodotto = $('#prodotto'),
			altezzaImg = img.height(),//leggo altezza originale del img
			altezza_prod = prodotto.height(),
			compressa = 500;//altezza dell'immagine quando viene vista compressa
		//console.log('altezza opriginale:'+altezzaImg+' altezza box:'+altezza_prod);
		
		if(altezzaImg > altezza_prod){
			$("#zoomOut").addClass("disabilitato");
			//console.log('altezza opriginale dentro if:'+altezzaImg);
			//alert("maggiore");
			//img.addClass("compressa");//aggiungo classe per comprimere img
			img.height(compressa);//aggiungo classe per comprimere img
			//var alt_compressa = img.css('maxHeight');
			//var alt_compressa = img.css('height');
			//console.log('altezza compressa: '+alt_compressa);
			
			$("#zoomIn").click(function(){
				img.animate({
					height:altezzaImg
				},'slow');
				$("#zoomIn,#zoomOut").toggleClass("disabilitato");
				//console.log('zummo dentro');
				return false;
			});
			$("#zoomOut").click(function(){
				img.animate({
					height:compressa
				},'slow');//.removeClass("compressa");
				$("#zoomIn,#zoomOut").toggleClass("disabilitato");
				//console.log('zummo fuori');
				return false;
			});
		} else {
			//console.log('altezza opriginale dentro else:'+altezzaImg);
			$("#zoomIn,#zoomOut").addClass("disabilitato");
		}
		
		//img.css('visibility','visible');
	}

	function inviaNotifiche(contiene, id_scatenante){
		//dato che queste 2 azioni devono essere scatenate sia su layer che sul coupon, uso come parametro l oggetto cui appendere il box con il form
		var contenitore;
		switch(contiene){
			case 'azioni'://da layer
				contenitore = $("#azioni");
				break;
			case 'coupon'://da coupon abstract
				contenitore = $(".coupon");
				break;
			case 'coupon_singolo'://da coupon pagina singola
				contenitore = $("#azioni");
				break;
			default :
				//console.log('sono nel case default');
		}
		/* contiene.find("a.mail").click(function(){//invia mail
			$("body").find("div.box_invia").remove();
			var box = $("<div class='box_invia'><h3>email</h3><a href='#' class='chiudi box'>&nbsp;</a><p>Lorem ipsum dolor sit amet</p></div>"),
				form_info = $("<form action='' method='' id='form_info_mail' name='form_info_mail'><input type='text' id='email' name='email'/><a id='invia' href='#'>invia</a></form>"),
				questo = $(this);
			box.append(form_info);
			questo.parent().append(box);
			controlliForm(form_info);
			chiudiLayer(box);
			return false;
		});
		
		contiene.find("a.sms").click(function(){//invia sms
			$("body").find("div.box_invia").remove();
			var box = $("<div class='box_invia'><h3>sms</h3><a href='#' class='chiudi box'>&nbsp;</a><p>Lorem ipsum dolor sit amet</p></div>"),
				form_info = $("<form action='' method='' id='form_info_sms' name='form_info_sms'><input type='text' id='sms' name='sms'/><a id='invia' href='#'>invia</a></form>"),
				questo = $(this);
			box.append(form_info);
			questo.parent().append(box);
			controlliForm(form_info);
			chiudiLayer(box);
			return false;
		}); */
		
		var coupon_content;
		contenitore.find("a.mail_sms").click(function(){
			clearInterval(t);
			$("body").find("div.box_invia").remove();
			var questo = $(this),
				tipologia = questo.attr('rel'),//sms oppure mail
				box = $('<div class="box_invia"><h3>'+tipologia+'</h3><a href="#" class="chiudi box" title="'+stampaMessaggi('layer','chiudi')+'">&nbsp;</a><p class="riscontro">'+stampaMessaggi(tipologia,'desc')+'</p></div>'),
				form_info = $('<form action="" method="" id="form_info_'+tipologia+'" name="form_info_'+tipologia+'"><input type="text" id="'+tipologia+'" name="'+tipologia+'" value="'+stampaMessaggi(tipologia,'predefinito')+'" /><input type="hidden" name="nome" /><input type="hidden" name="abstract" /><input type="hidden" name="link" /><input type="hidden" name="id" /><input type="hidden" name="coupon" /><a id="invia" href="#">'+stampaMessaggi('form','invia')+'</a></form>');
			switch(contiene){
				case 'azioni'://da layer
					coupon_content = id_scatenante;
					break;
				case 'coupon'://da coupon abstract
					//coupon_content = questo.closest('div.coupon_content').find('div.corredo a').attr('id').split('_')[1];//id della a da cui ricavare titolo, abstract link e immagine coupon
					coupon_content = questo.closest('div.coupon_content').find('div.corredo a').attr('id').replace('id_','');//id della a da cui ricavare titolo, abstract link e immagine coupon
					break;
				case 'coupon_singolo'://da coupon pagina singola
					//coupon_content = $('#prodotto').find('div.coupon_content div.corredo a').attr('id').split('_')[1];//id della a da cui ricavare titolo, abstract link e immagine coupon
					coupon_content = $('#prodotto').find('div.coupon_content div.corredo a').attr('id').replace('id_','');//id della a da cui ricavare titolo, abstract link e immagine coupon
					break;
				default :
					//console.log('sono nel case default');
			}
			box.append(form_info);
			questo.parent().append(box);
			controlliForm(form_info,tipologia,coupon_content);
			chiudiLayer(box);
			return false;
		});
	}

	function socialSingolo(identificativo) {//inietto addthis in pagina coupon singolo perche trasformate non accettano attributi non standard
		//console.log('eccoci');
		var cont_fb = $('#contenitore div.fb');
		cont_fb.find('div.preclick > a').click(function(){
			statistiche('social',identificativo);//avvio statistiche
			//alert('');
			var url_fb = $('#prodotto').find('div.coupon_content a').attr('rel');
			//$(this).parent('div.preclick').hide();
			cont_fb.html('<!-- AddThis Button BEGIN --><div class="addthis_toolbox addthis_default_style " addthis:url="'+url_fb+'" ><a class="addthis_button_facebook_like" fb:like:layout="button_count"></a><a class="addthis_button_tweet"></a><a class="addthis_counter addthis_pill_style"></a></div><!-- AddThis Button END -->');//versione con script nella head
			addthis.init();
			addthis.toolbox(".addthis_toolbox");
			addthis.counter(".addthis_counter");
			return false;
		});
	}

	function gestisciStatMenuInterno() {
		$('div.coupon_cat').children('div.coupon').each(function(){//mostro solo coupon della categoria accesa
			var id_coupon = $(this).find('div.corredo a').attr('id').replace('id_','');//statistiche impression
			//console.log(id_coupon);
			statistiche('impression',id_coupon);
		});
	
		$('#menu li a').click(function(){
			var id_categoria = $(this).parent('li').attr('class').split(' ')[0].split('_')[1],
				nome_categoria = $("#menu li.on a").text(),
				nome_citta = $("#attuale span").text();
			statistiche('categoria',id_categoria);
			
			nome_categoria = encodeURI(nome_categoria);
			nome_categoria = nome_categoria.replace('&','e');
			_gaq.push(['_trackPageview', '/'+nome_citta+'/clic-'+nome_categoria+'/']);
			//alert('');
			//niente return false perche il link deve effettivamente cambiare pagina
		});
	}
