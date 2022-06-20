import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class Home extends Component {

    constructor() {
        super();
        this.state = {
            mName : "",
            comingSoonMovies : [],
            nowShowingMovies : [],
            genreType : [],
            actors : [],
            genresList : [],
            actorsList : [],
            movieReleaseDate : "",
            movieReleaseEndDate : ""
        }
    }


    movieNameChangeHandler = event => {
        this.setState({ mName : event.target.value });
    }

    genreSelectHandler = event => {
        this.setState({ genreType : event.target.value });
    }

    artistSelectHandler = event => {
        this.setState({ actors : event.target.value });
    }

    releaseDateStartHandler = event => {
        this.setState({ movieReleaseDate : event.target.value });
    }

    releaseDateEndHandler = event => {
        this.setState({ movieReleaseEndDate : event.target.value });
    }

    movieClickHandler = (movieId) => {
        this.props.history.push('/movie/' + movieId);
    }

    
    componentWillMount() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    comingSoonMovies : JSON.parse(this.responseText).movies
                });
            }
        });

        xhr.open("GET", this.props.baseUrl + "movies?status=PUBLISHED");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);

        // Get released movies
        let dataReleased = null;
        let xhrReleased = new XMLHttpRequest();
        xhrReleased.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    nowShowingMovies : JSON.parse(this.responseText).movies
                });
            }
        });

        xhrReleased.open("GET", this.props.baseUrl + "movies?status=RELEASED");
        xhrReleased.setRequestHeader("Cache-Control", "no-cache");
        xhrReleased.send(dataReleased);

        // Get filters
        let dataGenres = null;
        let xhrGenres = new XMLHttpRequest();
        xhrGenres.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    genresList : JSON.parse(this.responseText).genreType
                });
            }
        });

        xhrGenres.open("GET", this.props.baseUrl + "genreType");
        xhrGenres.setRequestHeader("Cache-Control", "no-cache");
        xhrGenres.send(dataGenres);

        // Get actors
        let dataArtists = null;
        let xhrArtists = new XMLHttpRequest();
        xhrArtists.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    actorsList : JSON.parse(this.responseText).actors
                });
            }
        });

        xhrArtists.open("GET", this.props.baseUrl + "actors");
        xhrArtists.setRequestHeader("Cache-Control", "no-cache");
        xhrArtists.send(dataArtists);
    }

    filterApplyHandler = () => {
        let queryString = "?status=RELEASED";
        if (this.state.mName !== "") {
            queryString += "&title=" + this.state.mName;
        }
        if (this.state.genreType.length > 0) {
            queryString += "&genreType=" + this.state.genreType.toString();
        }
        if (this.state.actors.length > 0) {
            queryString += "&actors=" + this.state.actors.toString();
        }
        if (this.state.movieReleaseDate !== "") {
            queryString += "&start_date=" + this.state.movieReleaseDate;
        }
        if (this.state.movieReleaseEndDate !== "") {
            queryString += "&end_date=" + this.state.movieReleaseEndDate;
        }

        let that = this;
        let dataFilter = null;
        let xhrFilter = new XMLHttpRequest();
        xhrFilter.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    nowShowingMovies : JSON.parse(this.responseText).movies
                });
            }
        });

        xhrFilter.open("GET", this.props.baseUrl + "movies" + encodeURI(queryString));
        xhrFilter.setRequestHeader("Cache-Control", "no-cache");
        xhrFilter.send(dataFilter);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header baseUrl={this.props.baseUrl} />

                <div className={classes.upcomingMoviesHeading}>
                    <span>Upcoming Movies</span>
                </div>

                <GridList cols={5} className={classes.gridListUpcomingMovies} >
                    {this.state.comingSoonMovies.map(movie => (
                        <GridListTile key={"upcoming" + movie.id}>
                            <img src={movie.poster_url} className="movie-poster" alt={movie.title} />
                            <GridListTileBar title={movie.title} />
                        </GridListTile>
                    ))}
                </GridList>

                <div className="container">
                    <div className="left">
                        <GridList cellHeight={350} cols={4} className={classes.gridListMain}>
                            {this.state.nowShowingMovies.map(movie => (
                                <GridListTile onClick={() => this.movieClickHandler(movie.id)} className="released-movie-grid-item" key={"grid" + movie.id}>
                                    <img src={movie.poster_url} className="movie-poster" alt={movie.title} />
                                    <GridListTileBar
                                        title={movie.title}
                                        subtitle={<span>Release Date : {new Date(movie.release_date).toDateString()}</span>}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                    <div className="right">
                        <Card>
                            <CardContent>
                                <FormControl className={classes.formControl}>
                                    <Typography className={classes.title} color="textSecondary">
                                        FIND MOVIES BY :
                                    </Typography>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="mName">Movie Name</InputLabel>
                                    <Input id="mName" onChange={this.movieNameChangeHandler} />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-checkbox">Genres</InputLabel>
                                    <Select
                                        multiple
                                        input={<Input id="select-multiple-checkbox-genre" />}
                                        renderValue={selected => selected.join(',')}
                                        value={this.state.genreType}
                                        onChange={this.genreSelectHandler}
                                    >
                                        {this.state.genresList.map(genre => (
                                            <MenuItem key={genre.id} value={genre.genre}>
                                                <Checkbox checked={this.state.genreType.indexOf(genre.genre) > -1} />
                                                <ListItemText primary={genre.genre} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="select-multiple-checkbox">Artists</InputLabel>
                                    <Select
                                        multiple
                                        input={<Input id="select-multiple-checkbox" />}
                                        renderValue={selected => selected.join(',')}
                                        value={this.state.actors}
                                        onChange={this.artistSelectHandler}
                                    >
                                        {this.state.actorsList.map(artist => (
                                            <MenuItem key={artist.id} value={artist.first_name + " " + artist.last_name}>
                                                <Checkbox checked={this.state.actors.indexOf(artist.first_name + " " + artist.last_name) > -1} />
                                                <ListItemText primary={artist.first_name + " " + artist.last_name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="movieReleaseDate"
                                        label="Release Date Start"
                                        type="date"
                                        defaultValue=""
                                        InputLabelProps={{ shrink : true }}
                                        onChange={this.releaseDateStartHandler}
                                    />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="movieReleaseEndDate"
                                        label="Release Date End"
                                        type="date"
                                        defaultValue=""
                                        InputLabelProps={{ shrink : true }}
                                        onChange={this.releaseDateEndHandler}
                                    />
                                </FormControl>
                                <br /><br />
                                <FormControl className={classes.formControl}>
                                    <Button onClick={() => this.filterApplyHandler()} variant="contained" color="primary">
                                        APPLY
                                    </Button>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div >
        )
    }
}

const styles = theme => ({
    root : {
        flexGrow : 1,
        backgroundColor : theme.palette.background.paper
    },
    upcomingMoviesHeading : {
        textAlign : 'center',
        background : '#ff9999',
        padding : '8px',
        fontSize : '1rem'
    },
    gridListUpcomingMovies : {
        flexWrap : 'nowrap',
        transform : 'translateZ(0)',
        width : '100%'
    },
    gridListMain : {
        transform : 'translateZ(0)',
        cursor : 'pointer'
    },
    formControl : {
        margin : theme.spacing.unit,
        minWidth : 240,
        maxWidth : 240
    },
    title : {
        color : theme.palette.primary.light,
    }
});


export default withStyles(styles)(Home);