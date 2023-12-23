import './App.css';
import React, { useState } from 'react';
import './App.css';
import { IPostFormField, ISlideFormField } from './App.interfaces';

const App : React.FC = () => {

  const [title, setTitle] = useState<IPostFormField>({code: 'title', minLength: 10, maxLength: 50, placeholder: 'Inserisci titolo del post', value: ''});
  const [subtitle, setSubtitle] = useState<IPostFormField>({code: 'subtitle', minLength: 10, maxLength: 50, placeholder: 'Inserisci sottotitolo del post', value: ''});
  const [caption, setCaption] = useState<IPostFormField>({code: 'caption', minLength: 10, maxLength: 1300, placeholder: 'Inserisci caption del post', value: ''});
  const [sources, setSources] = useState<IPostFormField>({code: 'sources', minLength: undefined, maxLength: undefined, placeholder: 'Inserisci le fonti, una per riga', value: ''});

  const [slides, setSlides] = useState<ISlideFormField[]>([]);
  const [selectedSlide, setSelectedSlide] = useState<ISlideFormField>({ text: '', imageUrl: '' });

  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);

  const saveSlide = () => {

    if (selectedSlide.id === undefined || (slides.filter(f => f.id === selectedSlide.id).length === 0)) {
      selectedSlide.id = slides.length+1;

      let slideArray = slides;
      slides.push(selectedSlide);
      setSlides(slideArray);  
    }
    else {
      let slideArray = slides;
      let slide = slides.filter(f => f.id === selectedSlide.id)[0];
      slide.text = selectedSlide.text;
      slide.imageUrl = selectedSlide.imageUrl;

      setSlides(slideArray);
    }

    setSelectedSlide({ text: '', imageUrl: ''});
  }

  const deleteSlide = () => {

    if (slides.filter(f => f.id === selectedSlide.id).length === 0){
      return;
    }

    let slideArray = slides;
    let slide = slides.filter(f => f.id === selectedSlide.id)[0];
    let slideIndex = slideArray.indexOf(slide)
    slideArray.splice(slideIndex, 1);

    setSlides(slideArray);
    setSelectedSlide({ text: '', imageUrl: ''});
    setShowDeletePopup(false);
  }

  const exportData = async () => {

    let jsonData = {
      "text": "This feature has yet to be implemented"
    };

    let jsonString = JSON.stringify(slides, null, 2);

    const blob =  new Blob([jsonString], { type: 'application/json'});
    const href = await URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = "export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return(
    <div className='form-wrap'>
      <div className='centered-form'>

        <h1 className='form-title'>Modulo Creazione Materiale</h1>
        <p className='form-desc'>Utilizza questo modulo per creare i materiali per i post di Prometheus Project</p>

        <div className='form-data'>

          <label className='input-box'>
            <span className='input-lbl'>Titolo cover:</span>
            <input type='text' 
                  placeholder={title.placeholder}
                  value={title.value}
                  onChange={(e) => setTitle({...title, value: e.target.value})}
                  minLength={title.minLength} 
                  maxLength={title.maxLength} />
          </label>

          <label className='input-box'>
            <span className='input-lbl'>Sottotitolo cover:</span>
            <input type='text' 
                  placeholder={subtitle.placeholder} 
                  value={subtitle.value}
                  onChange={(e) => setSubtitle({...subtitle, value: e.target.value})}
                  minLength={subtitle.minLength} 
                  maxLength={subtitle.maxLength} />
          </label>

          <label className='input-box'>
            <span className='input-lbl'>Caption:</span>
            <textarea rows={9} 
                      placeholder={caption.placeholder} 
                      value={caption.value}
                      onChange={(e) => setCaption({...caption, value: e.target.value})}
                      minLength={caption.minLength} 
                      maxLength={caption.maxLength} />
          </label>

          <label className='input-box'>
            <span className='input-lbl'>Fonti:</span>
            <textarea rows={6} 
                      value={sources.value}
                      onChange={(e) => setSources({...sources, value: e.target.value})}
                      placeholder={sources.placeholder} />
          </label>

          <div className='slide-container'>
            <hr />

            { showDeletePopup &&
              <div className='del-popup-cont'>
                <div className='del-popup-bg' onClick={() => setShowDeletePopup(false)}></div>
                <div className='del-popup'>
                  <b>Sicuro di voler eliminare la slide? L'opzione non può essere annullata.</b>
                  <div className='del-btn-wrapper'>
                    <button className='action-btn delete' onClick={deleteSlide}>Elimina</button>
                    <span className='action-btn cancel' onClick={() => setShowDeletePopup(false)}>Annulla</span>
                  </div>
                </div>
              </div>
            }

            <div className='slide-list'>

              <span onClick={() => setSelectedSlide({text:'', imageUrl:'' })} className='slide-item'>Slide Vuota</span>

              { 
                slides && slides.map((el, index) => {
                  return(
                    <span onClick={() => setSelectedSlide(el)} className='slide-item' key={"slide-" + index}>Apri Slide {el.id}</span>
                  );
                }) 
              }

            </div>

            <label className='input-box'>
              <span className='input-lbl'>Testo Slide:</span>
              <textarea rows={6} 
                        placeholder="Inserisci il testo della slide" 
                        minLength={10} 
                        maxLength={400}
                        value={selectedSlide.text}
                        onChange={(e) => setSelectedSlide({...selectedSlide, text: e.target.value })} />
            </label>

            <label className='input-box'>
              <span className='input-lbl'>URL Immagine Slide (opzionale):</span>
              <input type='text' 
                    placeholder="Inserisci URL immagine suggerita, il campo non è obbligatorio"
                    value={selectedSlide.imageUrl} 
                    onChange={(e) => setSelectedSlide({...selectedSlide, imageUrl: e.target.value })} />
            </label>

            <div className='btn-wrapper'>
              <button onClick={saveSlide} className='action-btn'>Salva Slide</button>
              { selectedSlide.id && <button onClick={() => setShowDeletePopup(true)} className='action-btn delete'>Elimina Slide</button> }
            </div>

          </div>

          <hr/>
          <div className='download-wrapper'>
            <button onClick={exportData} className='action-btn download-btn'>Esporta Dati</button>
          </div>

        </div>
      </div>
    </div>
  );

}

export default App;