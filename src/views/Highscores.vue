<template>
    <div :class="$style.highscores">
        <div :class="$style.logoContainer">
            <img
                :class="$style.logo"
                src="../assets/svg/logo.svg"></img>
        </div>
        <div :class="$style.header">
            <h3>Highscores</h3>
        </div>
        <div :class="$style.highscoresContainer">
            <div :class="$style.mapHighscore">
                <div :class="$style.highscoreHeader">
                    <h4>Map 0</h4>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        1. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        2. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        3. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
            </div>
            <div :class="$style.mapHighscore">
                <div :class="$style.highscoreHeader">
                    <h4>Map 1</h4>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        1. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        2. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        3. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
            </div>
            <div :class="$style.mapHighscore">
                <div :class="$style.highscoreHeader">
                    <h4>Map 2</h4>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        1. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        2. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        3. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
            </div>
            <div :class="$style.mapHighscore">
                <div :class="$style.highscoreHeader">
                    <h4>Map 3</h4>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        1. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        2. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
                <div :class="$style.entry">
                    <div :class="$style.playerName">
                        3. Max Mustermann
                    </div>
                    <div :class="$style.score">
                        10000000000000
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style module>

    .highscores {
        color: white;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        font-family: Arial, sans-serif;
        font-size: 4vmin;
        background: url(../assets/svg/Background.svg) center center no-repeat fixed;
        background-size: cover;

        * {
            box-sizing: border-box;
        }
    }

    .header {
        display: flex;
        justify-content: center;
    }

    .logoContainer {
        display: flex;
        justify-content: flex-end;
        padding-right: 5vmin;
        padding-top: 5vmin;
    }

    .logo {
        width: 15%;
    }

    .highscoresContainer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center
    }

    .mapHighscore {
        display: flex;
        flex: 1;
        justify-content: center;
        border: 1px solid white;
        margin: 3vmin;
        font-size: .4em;
        flex-direction: column;
        padding: 20px;
        background-color: rgba(0, 79, 132, 0.2);
    }

    .highscoreHeader {
        display: flex;
        justify-content: center;
        h4 {
            margin: 0;
        }
    }

    .entry {
        display: flex;
        justify-content: space-between;
    }

    .playerName {
        text-align: center;
        margin: 10px;
    }

    .score {
        text-align: center;
        margin: 10px;
    }

</style>

<script>
export default {
    name: 'Highscores'
}

</script>
