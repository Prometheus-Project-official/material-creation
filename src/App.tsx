import './App.css';
import React, { useState } from 'react';
import { IPost, IPostFormData, ISlideFormField } from './App.interfaces';

const App : React.FC = () => {

  const [formData, setFormData] = useState<IPostFormData>({
    title: '',
    caption: '',
    sources: '',
    subtitle: '',
    slides: []
  });

  const [selectedSlide, setSelectedSlide] = useState<ISlideFormField>({ text: '', imageUrl: '', position: 1 });
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false);
  const [slideWarning, setSlideWarning] = useState<string | undefined>(undefined);
  const [exportWarning, setExportWarning] = useState<string | undefined>(undefined);

  const saveSlide = () => {

    if (!selectedSlide.text || selectedSlide.text.length === 0){
      setSlideWarning("La slide deve contenere del testo");
      return;
    }

    if (selectedSlide.text.length > 400) {
      setSlideWarning("Il testo della slide non può superare 400 caratteri");
      return;
    }

    if (selectedSlide.position < 1 || selectedSlide.position > 8){
      setSlideWarning("Il numero della slide deve essere compreso tra 1 e 8");
      return;
    }

    if (formData.slides.length >= 8) {
      setSlideWarning("Un post può avere al massimo 8 slide di contenuto.");
      return;
    }

    if (selectedSlide.id === undefined || (formData.slides.filter(f => f.id === selectedSlide.id).length === 0)) {

      if (formData.slides.filter(f => f.position === selectedSlide.position).length > 0) {
        setSlideWarning("Esiste già una slide nella posizione " + selectedSlide.position);
        return;
      }

      selectedSlide.id = formData.slides.length+1;

      let slideArray = formData.slides;
      slideArray.push(selectedSlide);
      setFormData({...formData, slides: slideArray});  
    }
    else {
      let slideArray = formData.slides;
      let slide = formData.slides.filter(f => f.id === selectedSlide.id)[0];
      slide.text = selectedSlide.text;
      slide.imageUrl = selectedSlide.imageUrl;

      setFormData({...formData, slides: slideArray});
    }

    reorderSlides();
    resetSelectedSlide();
  }

  const reorderSlides = () => {
    let slideArray = formData.slides;
    slideArray.sort((a, b) => a.position - b.position);
    setFormData({...formData, slides: slideArray});  
  }

  const resetSelectedSlide = () => {
    setSelectedSlide({ text: '', imageUrl: '', position: 1 });
  }

  const deleteSlide = () => {

    if (formData.slides.filter(f => f.id === selectedSlide.id).length === 0){
      return;
    }

    let slideArray = formData.slides;
    let slide = formData.slides.filter(f => f.id === selectedSlide.id)[0];
    let slideIndex = slideArray.indexOf(slide)
    slideArray.splice(slideIndex, 1);

    setFormData({...formData, slides: slideArray});
    
    reorderSlides();
    resetSelectedSlide();
    setShowDeletePopup(false);
  }

  const validateAllData = () : boolean => {
    if (formData.title && formData.title.length <= 40 &&
        formData.subtitle && formData.subtitle.length <= 60 &&
        formData.caption && formData.caption.length <= 1300 &&
        formData.sources &&
        formData.slides && formData.slides.length > 0 && formData.slides.length < 9)
        {
          return true;
        }

    return false;
  }

  const exportData = async () => {

    if (!validateAllData()){
      setExportWarning("Attenzione, non tutti i campi sono stati compilati correttamente");
      return;
    }

    let post : IPost = {
      title: formData.title,
      caption: formData.caption,
      sources: formData.sources,
      subtitle: formData.subtitle,
      slides: []
    };

    formData.slides.forEach((el, index) => {
      post.slides.push({
        text: el.text,
        imageUrl: el.imageUrl,
        position: el.position
      });
    });

    const blob =  new Blob([JSON.stringify(post, null, 2)], { type: 'application/json'});
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
            <span className='input-lbl'>Titolo cover: <i className='char-limit'>{formData.title.length}/40 car.</i></span>
            <input type='text' 
                  placeholder="Inserisci titolo del post"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  maxLength={40} />
          </label>

          <label className='input-box'>
            <span className='input-lbl'>Sottotitolo cover: <i className='char-limit'>{formData.subtitle.length}/60 car.</i></span>
            <input type='text' 
                  placeholder={'Inserisci sottotitolo del post'} 
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  maxLength={60} />
          </label>

          <label className='input-box'>
            <span className='input-lbl'>Caption:  <i className='char-limit'>{formData.caption.length}/1300 car.</i></span>
            <textarea rows={9} 
                      placeholder={'Inserisci caption del post'} 
                      value={formData.caption}
                      onChange={(e) => setFormData({...formData, caption: e.target.value})}
                      maxLength={1300} />
          </label>

          <label className='input-box'>
            <span className='input-lbl'>Fonti:</span>
            <textarea rows={6} 
                      value={formData.sources}
                      onChange={(e) => setFormData({...formData, sources: e.target.value})}
                      placeholder={'Inserisci le fonti, una per riga'} />
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

              <span onClick={resetSelectedSlide} className='slide-item'>Slide Vuota</span>

              { 
                formData.slides && formData.slides.map((el, index) => {
                  return(
                    <span onClick={() => setSelectedSlide(el)} className='slide-item' key={"slide-" + index}>Apri Slide {el.position}</span>
                  );
                }) 
              }

            </div>

            <label className='input-box'>
              <span className='input-lbl'>Testo Slide:  <i className='char-limit'>{selectedSlide.text.length}/400 car.</i></span>
              <textarea rows={6} 
                        placeholder="Inserisci il testo della slide" 
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

            <label className='input-box'>
              <span className='input-lbl'>Ordine Slide (1-8):</span>
              <input type='number' 
                     min={1}
                     max={8}
                     placeholder="Inserisci URL immagine suggerita, il campo non è obbligatorio"
                     value={selectedSlide.position} 
                     onChange={(e) => setSelectedSlide({...selectedSlide, position: parseInt(e.target.value) })} />
            </label>

            { slideWarning && 
              <div className='slide-warning-wrap'>
                <div onClick={() => setSlideWarning(undefined)} className='slide-warning-bg'></div>
                <div className='slide-warning-msg'>
                  <p className='slide-warning-txt'>{slideWarning}</p>
                  <div className='slide-warning-btn'>
                    <button onClick={() => setSlideWarning(undefined)} type='button' className='action-btn cancel'>Chiudi</button>  
                  </div>
                </div>
              </div>
            }

            <div className='btn-wrapper'>
              <button onClick={saveSlide} type='button' className='action-btn'>Salva Slide</button>
              { selectedSlide.id && <button onClick={() => setShowDeletePopup(true)} type='button' className='action-btn delete'>Elimina Slide</button> }
            </div>

          </div>

          <hr/>

          <div className='download-wrapper'>
            { exportWarning && 
              <div className='export-warning-wrap'>
              <div onClick={() => setExportWarning(undefined)} className='export-warning-bg'></div>
              <div className='export-warning-msg'>
                <p className='export-warning-txt'>{exportWarning}</p>
                <div className='export-warning-btn'>
                  <button onClick={() => setExportWarning(undefined)} type='button' className='action-btn cancel'>Chiudi</button>  
                </div>
              </div>
            </div>
            }
            <button type='button' onClick={exportData} className='action-btn download-btn'>Esporta Dati</button>
          </div>

        </div>

      </div>
    </div>
  );

}

export default App;