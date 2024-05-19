import React, { useState, useEffect } from 'react';
import BookFeedEntry from './BookFeedEntry';
import '../styles/booksFeed.css'; // Import your CSS file for styling
import swal from 'sweetalert';
function BooksFeed() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    

    async function perfilPropietario(idPropietario){
        console.log("Propietario "+idPropietario);
        localStorage.setItem('id propietario', idPropietario);

        window.location.href = "/userProfile.html";

    }
    async function fetchBooks() {
        const userId = localStorage.getItem("token id");
        try {
            const booksResponse = await fetch('/api/feedBooks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userId}`
                }
            })
            if (booksResponse.ok) {
                const booksData = await booksResponse.json();
                setBooks(booksData);
            }
        } catch (error) {
            //alert("No se pudo cargar el feed")
            swal({
                icon:"error",
                title:"No se pudo cargar el feed"
                })
        }
    }

    async function solicitarPrestamo(idLibro, idUsuario){
        const idUserToken =  localStorage.getItem("token id");



        console.log("borrow clicked " + idLibro + " id usuario propietario" +idUsuario+ " mi Id "+ idUserToken);
        try {
            const loanRequest = await fetch(`/api/loanRequest/${idLibro}?idUsuario=${idUsuario}`,{
                method: 'POST',
                headers:{
                    'Authorization':`Bearer ${idUserToken}`
                }
            })

            if(loanRequest.ok){
                const responseJson = await loanRequest.json();
                alert(responseJson.message);
            }


        } catch (error) {
            //alert("No se pudo solicitar el prestamo")
            swal({
                icon:"error",
                title:"No se pudo solicitar el prestamo"
            })
        }
        
    }

    return (
        <div className="books-feed-container">
            <h1 style={{fontFamily:"Arial, Helvetica, sans-serif", paddingLeft: '20px'}}>Para ti</h1>
            <div className="books-grid">
                {books.map(bookItem => (
                    <BookFeedEntry
                        key={bookItem.id_libro}
                        id={bookItem.id_libro}
                        titulo={bookItem.titulo}
                        autor={bookItem.autor}
                        isbn={bookItem.isbn}
                        propietario={bookItem.nombres}
                        propietarioId={bookItem.id}
                        descripcion={bookItem.descripcion}
                        coverimage={bookItem.coverimage}
                        tags={bookItem.tagsarray}
                        onClick={solicitarPrestamo}
                        onClickPropietario={perfilPropietario}
                    />
                ))}
            </div>
        </div>
    )
}

export default BooksFeed;