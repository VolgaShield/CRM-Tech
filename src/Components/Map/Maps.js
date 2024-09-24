import {Map, GoogleApiWrapper, Marker, InfoWindow} from "google-maps-react";
import {Component} from "react";
import styles from "./Maps.module.scss"
import MapNav from "./mapNav";

const mapStyle = [
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]


class WithMarkers extends Component {
    state = {
        activeMarker: {},
        selectedPlace: {},
        showingInfoWindow: false
    };

    onMarkerClick = (props, marker) =>
        this.setState({
            activeMarker: marker,
            selectedPlace: props,
            showingInfoWindow: true
        });

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });

    onMapClicked = () => {
        if (this.state.showingInfoWindow)
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
    };


    _mapLoaded(mapProps, map) {
        map.setOptions({
            styles: mapStyle
        })
    }

    handleClick = () => {
        //console.log('значение this:', this);
    }
    render() {
        //console.log(this.props)
        if (!this.props.loaded) return <div>Loading...</div>;

        return (
            <Map
                className="map"
                google={this.props.google}
                onClick={this.onMapClicked}
                style={{ height: '95%', position: 'relative', width: '100%' }}
                zoom={15}
                gestureHandling={"greedy"}
                onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
                initialCenter={{
                    lat: 46.3375031,
                    lng: 48.02041759999999
                }}
            >
                


                {this.props.nav === 'null' ? this.props.items.map(el => {
                    if (el[8] === 'Заявка') {
                        return <Marker icon="https://volga24bot.com/icons/req.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                       position={{lat: +el[35], lng: el[36]}} optimized={true}/>
                    } else if (el[8] === 'ТО') {
                        return <Marker icon="https://volga24bot.com/icons/to.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                       position={{lat: +el[35], lng: el[36]}} optimized={true}/>
                    } else if (el[8] === 'Монтаж') {
                        return <Marker icon="https://volga24bot.com/icons/mon.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                       position={{lat: +el[35], lng: el[36]}} optimized={true}/>
                    } else if (el[8] === 'Демонтаж') {
                        return <Marker icon="https://volga24bot.com/icons/dem.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                       position={{lat: +el[35], lng: el[36]}} optimized={true}/>
                    } else if (el[8] === 'Претензия') {
                        return <Marker icon="https://volga24bot.com/icons/red4.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                       position={{lat: +el[35], lng: el[36]}} optimized={true}/>
                    } else if (el[8] === 'СО') {
                        return <Marker icon="https://volga24bot.com/icons/so.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                       position={{lat: +el[35], lng: el[36]}} optimized={true}/>
                    }

                }) : null}
                {this.props.nav === 'req' ? this.props.items.filter(el => el[8] === 'Заявка').map(el => {
                    return <Marker icon="https://volga24bot.com/icons/req.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                   position={{lat: +el[35], lng: el[36]}} optimized={true}/>
                }) : null}
                {this.props.nav === 'to' ? this.props.items.filter(el => el[8] === 'ТО').map(el => {
                    return <Marker icon="https://volga24bot.com/icons/to.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                   position={{lat: +el[35] , lng: el[36]}} optimized={true}/>
                }) : null}
                {this.props.nav === 'pre' ? this.props.items.filter(el => el[8] === 'Претензия').map(el => {
                    return <Marker icon="https://volga24bot.com/icons/red4.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                   position={{lat: +el[35] , lng: el[36]}} optimized={true}/>
                }) : null}
                {this.props.nav === 'mon' ? this.props.items.filter(el => el[8] === 'Монтаж').map(el => {
                    return <Marker icon="https://volga24bot.com/icons/mon.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                   position={{lat: +el[35] , lng: el[36]}} optimized={true}/>
                }) : null}
                {this.props.nav === 'dem' ? this.props.items.filter(el => el[8] === 'Демонтаж').map(el => {
                    return <Marker icon="https://volga24bot.com/icons/dem.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                   position={{lat: +el[35], lng: el[36]}} optimized={true}/>
                }) : null}
                {this.props.nav === 'so' ? this.props.items.filter(el => el[8] === 'СО').map(el => {
                    return <Marker icon="https://volga24bot.com/icons/so.png" key={el[0]} name={el[2]} type={el[8]} address={el[4]} problem={el[13]} dateCreate={el[17]} onClick={this.onMarkerClick}
                                   position={{lat: +el[35], lng: el[36]}} optimized={true} />
                }) : null}

                <InfoWindow
                    marker={this.state.activeMarker}
                    onClose={this.onInfoWindowClose}
                    visible={this.state.showingInfoWindow}
                    onClick={console.log(this.props.items)}
                >
                    <div className={styles.infoWrapper} >
                        <p className={styles.type}>{this.state.selectedPlace.type}</p>
                        <p className={styles.name}>{this.state.selectedPlace.name}</p>
                        <p className={styles.address}>{this.state.selectedPlace.address}</p>
                        <p className={styles.problem}>{this.state.selectedPlace.problem}</p>
                        <p className={styles.time}>{this.state.selectedPlace.dateCreate}</p>

                    </div>



                </InfoWindow>
                <MapNav/>

            </Map>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyDhUzpGn20sxCXKwb8tLohPMAXQAiWroNU",
    language: 'ru'
})(WithMarkers)