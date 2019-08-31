    const fileReader  = new FileReader();
	let draggedTo_imgElem = null;
    const cardsList =  Array.from(document.querySelectorAll('.card'));

	fileReader.addEventListener("load", function () {

		draggedTo_imgElem.src = fileReader.result;
        enableOrDisableConfirmBtn()

	});

	fileReader.addEventListener("error", function () {

		alert('An error has occured during img processing, please try again');
});

    const imagesArr = Array.from(document.querySelectorAll('.cstm_img_holder'));
    const confirmBtn = document.querySelector('#customizeConfirmBtn');
    function dragOverHandler(ev) {

        ev.preventDefault();

        if(ev.target.parentElement.classList[0] === 'drop_zone_back_card') {
            //ev.target.parentElement.classList = ['drop_zone_back_card_dragged']
            ev.target.style.backgroundColor = '#774242';
        } else {
            ev.target.parentElement.classList = ['drop_zone_dragged']
        }

    }

    function dragOutHandler(ev) {

      ev.preventDefault();
      if(ev.target.parentElement.classList[0] === 'drop_zone_dragged') {
          ev.target.parentElement.classList = ['drop_zone']



      }else{
          //ev.target.parentElement.classList = ['drop_zone_back_card']

          ev.target.style.backgroundColor = 'transparent ';

  }
    }

    function dropHandler(ev) {

	  ev.preventDefault();

	  const allowedFileTypes = ['image/jpeg', 'image/png'];
	  draggedTo_imgElem = document.querySelector('#'+ev.target.id); //the image element to present the image in it
      let file = null;

	  if (ev.dataTransfer.items) {

		  const candidate = ev.dataTransfer.items[0];

          if (candidate.kind === 'file' && allowedFileTypes.includes(candidate.type)) {

			file = candidate.getAsFile();
		    if (file) {

			  fileReader.readAsDataURL(file);
		    }
          }else {

			alert(`FileType ${candidate.type} is not allowed (jpg/png only)`);
		  }

      }
      // Pass event to removeDragData for cleanup
      removeDragData(ev)
    }

    function enableOrDisableConfirmBtn() {

        const emptyImg = imagesArr.find(img => !img.src );
        if(!emptyImg) {

            confirmBtn.removeAttribute('disabled')
        }else {

            confirmBtn.setAttribute('disabled', '');

        }
    }

    function resetCards() {

        let customizedCards_idx = 0 ;
        //let evenCouner = 1;
        for(let cardList_idx = 0; cardList_idx < cardsList.length ; cardList_idx++) {

            // every i+=2 we do j++

            let pair = cardsList.filter(card => card.id == cardList_idx + 1);

            pair.forEach(card => {

                card.querySelector('.card-front').src= imagesArr[customizedCards_idx].src;
                card.querySelector('.card-back').src = imagesArr[imagesArr.length - 1].src;
            })

            customizedCards_idx++;

        }

        document.querySelector('#customize').style.display = "none";
        UserDataManager.setCustomizedDeck(imagesArr);
    }

    function removeDragData(ev) {
      console.log('Removing drag data')
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        ev.dataTransfer.items.clear();
      } else {
        // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
      }
    }
    this.enableOrDisableConfirmBtn()

    function fillImageHolders(images) {

        imagesArr.forEach((img, idx) => img.src = images[idx]);
        this.enableOrDisableConfirmBtn()
    }

    function clearImageHolders() {

        imagesArr.forEach(img => img.removeAttribute('src'));

        this.enableOrDisableConfirmBtn()


    }
