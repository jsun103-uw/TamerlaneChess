import React from "react";
import { Link } from "react-router-dom";
import { PATH_ROOT, PATH_SERVERS } from "../Consts";
import './RulePage.css';

const pieceRules: Array<{ name: string; move: string }> = [
    { name: "King", move: "1 square in any direction." },
    { name: "Prince", move: "Same movement as the king (created by Pawn of Kings promotion)." },
    { name: "Adventitious King", move: "Same movement as the king (created by Pawn of Pawns promotion in this build)." },
    { name: "Rook", move: "Slides orthogonally any distance." },
    { name: "Picket", move: "Slides diagonally, but must move at least 2 squares." },
    { name: "Knight", move: "Leaps as a standard knight (2 by 1)." },
    { name: "Camel", move: "Leaps as a 3 by 1 knight-like move." },
    { name: "Dabbaba", move: "Leaps exactly 2 squares orthogonally." },
    { name: "Elephant", move: "Leaps exactly 2 squares diagonally." },
    { name: "Giraffe", move: "Moves 1 diagonal then continues orthogonally at least 3 more squares, with path clearance required." },
    { name: "General", move: "1 square diagonally." },
    { name: "Vizier", move: "1 square orthogonally." },
    { name: "Pawn", move: "Moves 1 forward, captures 1 step diagonally forward. No 2-step opener and no en passant." },
];

export function RulePage() {
    return (
        <main className="rule-page">
            <header className="rule-header">
                <p className="rule-kicker">Rule Overview</p>
                <h1>Tamerlane Chess Quick Start</h1>
                <p>
                    This page gives a fast orientation so players can join a match without reading
                    a full manual first.
                </p>
            </header>

            <section className="rule-section">
                <h2>Overview</h2>
                <p>
                    The board is 11 files by 10 ranks with 2 extra citadel squares shown on the
                    flanks. Each side starts with 3 rows of pieces, including royal pieces and a
                    full set of named pawns.
                </p>
                <ul>
                    <li>Files are A through K.</li>
                    <li>Both players start with identical material mirrored by side.</li>
                </ul>
            </section>

            <section className="rule-section">
                <h2>How Matches Start</h2>
                <p>
                    Open the server list, create a new server if none exists, or join an available
                    one. Once both players are connected, the game board can begin.
                </p>
            </section>

            <section className="rule-section">
                <h2>Piece Movement (Engine-Accurate)</h2>
                <div className="rule-piece-list">
                    {pieceRules.map((piece) => (
                        <article className="rule-piece-card" key={piece.name}>
                            <h3>{piece.name}</h3>
                            <p>{piece.move}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="rule-section">
                <h2>Promotion Rules</h2>
                <ul>
                    <li>Each named pawn promotes on the last rank to its matching piece type.</li>
                    <li>Pawn of Kings promotes to Prince.</li>
                    <li>Pawn of Pawns promotes to Adventitious King.</li>
                </ul>
            </section>

            <section className="rule-section">
                <h2>Useful Tips</h2>
                <ul>
                    <li>Develop pieces early rather than overcommitting one flank.</li>
                    <li>Protect key ranks to avoid surprise tactical breaks.</li>
                    <li>Trade into favorable structures when ahead in activity.</li>
                </ul>
            </section>

            <nav className="rule-nav" aria-label="Rule page navigation">
                <Link className="rule-link" to={PATH_ROOT}>Back to Home</Link>
                <Link className="rule-link rule-link-primary" to={PATH_SERVERS}>Go to Servers</Link>
            </nav>
        </main>
    )
}