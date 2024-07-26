import { Injectable } from '@angular/core';
import { Map } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style } from 'ol/style';
import {
  fPropertyVectorRendererFunc,
  fPropertyVectorRendererFunc_labels,
} from '../styles/fprop-styles';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeatureLayerService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  constructor() {}

  addFeaturesLayer(map: Map): void {
    this.loadingSubject.next(true);
    fetch(
      'http://newatlasbe.ceyinfo.cloud/matlas/view_hotplay_table_with_sponsor/Athabasca%20Basin'
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((json) => {
        if (json.data && json.data[0].json_build_object.features) {
          const features = new GeoJSON().readFeatures(
            json.data[0].json_build_object
          );

          const vectorSource = new VectorSource();

          const labelVectorSource = new VectorSource();

          vectorSource.on('addfeature', (event) => {
            const feature = event.feature;

            if (feature) {
              const svgtext2 = feature.get('hatch');

              if (svgtext2) {
                const img = new Image();

                img.onload = function () {
                  feature.set('hatchimg', img);
                };

                img.src =
                  'data:image/svg+xml;utf8,' + encodeURIComponent(svgtext2);
              } else {
                console.log('No hatch property found for feature');
              }
            } else {
              console.log('No feature found');
            }
          });

          vectorSource.addFeatures(features);

          labelVectorSource.addFeatures(features);

          const vectorLayer = new VectorLayer({
            source: vectorSource,
          });

          const labelVectorLayer = new VectorLayer({
            source: labelVectorSource,
          });

          map.addLayer(vectorLayer);
          map.addLayer(labelVectorLayer);

          const style = new Style({});
          style.setRenderer(fPropertyVectorRendererFunc);

          const labelStyle = new Style({});
          labelStyle.setRenderer(fPropertyVectorRendererFunc_labels);

          vectorLayer.setStyle(style);
          labelVectorLayer.setStyle(labelStyle);
          this.loadingSubject.next(false);
        } else {
          console.log('No features found in JSON');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
 
  }
}
