import React from "react";
import './HomePage.css'
import { Link } from "react-router-dom";
import { PATH_RULES, PATH_SERVERS } from "../Consts";

export default function HomePage() {
    return (
        <main className="home-page">
            <section className="home-hero">
                <p className="home-kicker">Tamerlane Chess</p>
                <h1>Lead Your Court Into Battle</h1>
                <p className="home-subtitle">
                    Build a server, challenge an opponent, and play a larger-than-life game
                    with citadels, named pawns, and expanded royal strategy.
                </p>
                <div className="home-actions">
                    <Link className="home-button home-button-primary" to={PATH_SERVERS}>
                        Enter Servers
                    </Link>
                    <Link className="home-button home-button-secondary" to={PATH_RULES}>
                        Read Rules
                    </Link>
                </div>
            </section>

            <section className="home-cards" aria-label="Quick links">
                <article className="home-card">
                    <h2>Multiplayer Servers</h2>
                    <p>Create a server or join an active one to start a live match.</p>
                    <Link className="home-card-link" to={PATH_SERVERS}>Go to Server List</Link>
                </article>
                <article className="home-card">
                    <h2>How Tamerlane Works</h2>
                    <p>Learn objectives, setup, and core movement before your first match.</p>
                    <Link className="home-card-link" to={PATH_RULES}>Open Rule Page</Link>
                </article>
            </section>
        </main>
    )
}