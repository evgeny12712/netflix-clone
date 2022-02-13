import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Row.css'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

const BASE_URL = "https://image.tmdb.org/t/p/original/"
export default function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([])
    const [trailerUrl, setTrailerUrl] = useState('')
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(`https://api.themoviedb.org/3${fetchUrl}`)
            setMovies(request.data.results)
            return request
        }
        fetchData()
    }, [fetchUrl])

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    }

    const handleClick = (movie) => {
        if (trailerUrl) setTrailerUrl('')
        else {
            console.log(movie)
            movieTrailer(movie?.name || movie?.title || '')
                .then(url => {
                    console.log(url)
                    const urlParams = new URLSearchParams(new URL(url).search)
                    setTrailerUrl(urlParams.get('v'));
                })
                .catch((error) => console.log(error))
        }
    }

    return (
        <section className="row">
            <h2>{title}</h2>
            <div className="row-posters">
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        className={`row-poster ${isLargeRow && "row-poster-large"}`}
                        src={`${BASE_URL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name}
                        onClick={() => handleClick(movie)} />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </section>
    )
}
