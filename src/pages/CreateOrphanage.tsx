import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';

import {LeafletMouseEvent} from 'leaflet';

import { useHistory } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import Sidebar from '../components/Sidebar';
import api from '../services/api';

import happyMapIcon from '../util/mapIcon';

import '../styles/pages/create-orphanage.css';


export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);


  function headleMapClick(event: LeafletMouseEvent){
    const {lat, lng} = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  function headleSelectImage(event: ChangeEvent<HTMLInputElement>){
    event.preventDefault();

    if(!event.target.files){
      return ;
    }

    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectImagesPreview = selectedImages.map(image => {

      return URL.createObjectURL(image);
    });


    setPreviewImages(selectImagesPreview);

  }

  async function headleSubmit(event: FormEvent){
    event.preventDefault();
    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    
    images.forEach(image => {
      data.append('images', image);
    });

    await api.post('/orphanages', data);

    alert('Cadastrado com Sucesso !');

    history.push('/app');



    console.log(
      {latitude,
      longitude,
      name,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    }
    )
  }
  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={headleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-5.0430735,-42.469331]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={headleMapClick}
            >
              <TileLayer 
              url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                //url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {position.latitude !== 0
                ? <Marker interactive={false} icon={happyMapIcon} position={[position.latitude,position.longitude]} />
                : null}

              {/*  */}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                value={name} 
                onChange={event => setName(event.target.value)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="about" 
                maxLength={300} 
                value={about} 
                onChange={event => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="image[]">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <img key={image} src={image} alt={image}/>
                  )
                })}
                  <label htmlFor="image[]" className="new-image">
                    <FiPlus size={24} color="#15b6d6" />
                  </label>
              </div>
                  <input multiple onChange={headleSelectImage} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions"
                value={instructions} 
                onChange={event => setInstructions(event.target.value)}
               />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Nome</label>
              <input 
                id="opening_hours"
                value={opening_hours} 
                onChange={event => setOpeningHours(event.target.value)}
               />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                  >
                  Sim
                </button>
                <button 
                  type="button"
                  className={open_on_weekends ? '' : 'active'}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
