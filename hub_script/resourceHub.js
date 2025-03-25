// Start sample code
const sampleCode = `
            <div class="poster-bg">
            <div class="header">
                <div class="uploader">
                    <div class="container-left">
                        <div class="logo">
                            <img src="logos/logo_png.png" alt="Uploader Profile Picture">
                        </div>
                        <div class="details">
                            <div class="name-container">
                                <span class="name">Hridoy Hossen</span>
                                <span class="badge"></span>
                            </div>
                            <div class="upload-date-container">
                                <span class="upload-date-sponsore">
                                    <span class="upload-date">2022-03-10</span>
                                    <span class="upload-sponsored">Sponsored</span>
                                </span>
                                <span class="world-icon">
                                    <i class="fa-solid fa-earth-asia"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="container-right">
                        <svg class="dot-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M222.72-391.52q-36.63 0-62.68-25.99Q134-443.5 134-480q0-36.96 25.99-62.72 25.99-25.76 62.49-25.76 36.73 0 62.88 25.76 26.16 25.76 26.16 62.44 0 36.67-26.08 62.72-26.09 26.04-62.72 26.04Zm257.56 0q-36.67 0-62.72-25.99-26.04-25.99-26.04-62.49 0-36.96 25.99-62.72 25.99-25.76 62.49-25.76 36.96 0 62.72 25.76 25.76 25.76 25.76 62.44 0 36.67-25.76 62.72-25.76 26.04-62.44 26.04Zm257.4 0q-36.79 0-63-25.99-26.2-25.99-26.2-62.49 0-36.96 26.2-62.72 26.21-25.76 63-25.76 36.8 0 62.56 25.76Q826-516.96 826-480.28q0 36.67-25.76 62.72-25.76 26.04-62.56 26.04Z"/></svg>
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="content-header">
                    <span class="title">Create a Neural Network this is the future of technology let's learn and build together</span>
                    <br>
                    <span class="tags">#ai #neuralnetwork #roovix #hridoy</span>
                </div>
                <div class="content-body">
                    <div class="video">
                        <iframe width="100%" class="video-frame"
                            src="https://www.youtube.com/embed/9VOKIArZzp8"
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div class="video"></div>
                    <div class="content-description">
                        <span class="description" id="description">
                            In machine learning, a neural network (also artificial neural network or neural net, abbreviated ANN or NN) is a model inspired by the structure and function 
                            of biological neural networks in animal brains.[1][2]
    

                            An ANN consists of connected units or nodes called artificial neurons, 
                            which loosely model the neurons in the brain. Artificial neuron models that mimic biological neurons
                            more closely have also been recently investigated and shown to significantly improve performance. These are connected by edges, which model the synapses in the brain. Each artificial neuron receives signals from connected neurons, then processes them and sends 
                            
                            <div class="code-block">
                                <div class="action">
                                    <span class="code-name">Python</span>
                                    <button class="copy-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M379.78-233.78q-44.3 0-75.15-30.85-30.85-30.85-30.85-75.15v-466.44q0-44.3 30.85-75.15 30.85-30.85 75.15-30.85h346.44q44.3 0 75.15 30.85 30.85 30.85 30.85 75.15v466.44q0 44.3-30.85 75.15-30.85 30.85-75.15 30.85H379.78Zm0-106h346.44v-466.44H379.78v466.44Zm-186 292q-44.3 0-75.15-30.85-30.85-30.85-30.85-75.15v-572.44h106v572.44h452.44v106H193.78Zm186-292v-466.44 466.44Z"/></svg> Copy code</button>
                                </div>
                                <pre class="line-numbers"><code class="language-python">import random
import string

def generate_password():
    length = int(input("Enter the desired password length: "))
    include_digits = input("Include digits? (yes/no): ").lower() == 'yes'
    include_special_chars = input("Include special characters? (yes/no): ").lower() == 'yes'

    characters = string.ascii_letters
    if include_digits:
        characters += string.digits
    if include_special_chars:
        characters += string.punctuation

    password = ''.join(random.choice(characters) for _ in range(length))
    return password

password = generate_password()
print("Generated Password:", password)
                                    </code></pre>                                    
                            </div>

                            a signal to other connected neurons. The "signal" is a real number, and the output of each neuron is computed by some non-linear function of the sum of its inputs, called the activation function. The strength of the signal at 
                            each connection is determined by a weight, which adjusts during the learning process.
                        </span>
                        <a href="#" id="seeMore" onclick="toggleText(event)">See more</a>
                    </div>
                </div>
                <div class="content-footer">
                    <div class="action-1">
                        <div class="comment-container">
                            <div class="comment-count">
                                <span>399</span>
                                <span>Comments</span>
                            </div>
                            <svg class="comment-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M912.22-45.52 747.13-210.61h-411.3q-44.31 0-75.16-30.85-30.84-30.84-30.84-75.15v-40h430.39q44.3 0 75.15-30.85 30.85-30.84 30.85-75.15v-269.26h40q44.3 0 75.15 30.85 30.85 30.85 30.85 75.15v580.35ZM153.78-522.18l20.44-20.43h406v-265.87H153.78v286.3Zm-106 254.05v-540.35q0-44.3 30.85-75.15 30.85-30.85 75.15-30.85h426.44q44.3 0 75.15 30.85 30.85 30.85 30.85 75.15v265.87q0 44.31-30.85 75.15-30.85 30.85-75.15 30.85h-363.4L47.78-268.13Zm106-274.48v-265.87 265.87Z"/></svg>
                        </div>
                        <div class="share-container">
                            <svg class="share-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M682.23-60.78q-57.32 0-97.4-39.95-40.09-39.94-40.09-97.01 0-5.43 2.43-22.91L285.39-372.78q-17.69 14.43-39.77 22.65-22.08 8.22-47.32 8.22-57.3 0-97.41-40.24t-40.11-97.72q0-57.48 40.11-97.85t97.41-40.37q25.13 0 47.83 8.5t40.96 23.5l259.52-151q-1.44-5.87-1.65-12.08-.22-6.22-.22-12.53 0-57.3 40.12-97.41t97.43-40.11q57.32 0 97.41 40.12 40.08 40.12 40.08 97.44 0 57.31-40.11 97.4t-97.41 40.09q-26.47 0-49.62-9.07-23.16-9.06-41.42-25.19L333.96-509.7q2 7.6 2.5 14.65.5 7.05.5 15.33 0 8.29-.79 15.92-.78 7.63-2.78 15.19l256.7 148.74q18.26-16.7 41.78-26.33 23.51-9.63 50.39-9.63 57.3 0 97.41 40.24t40.11 97.72q0 57.48-40.12 97.28-40.12 39.81-97.43 39.81Zm-.32-100.35q15.66 0 26.59-10.7t10.93-26.52q0-15.82-10.85-26.48-10.85-10.65-26.88-10.65-15.56 0-26.09 10.94-10.52 10.93-10.52 26.24 0 15.3 10.58 26.23 10.59 10.94 26.24 10.94ZM198.35-442.26q15.82 0 27.04-10.82 11.22-10.81 11.22-26.8t-11.22-26.92q-11.22-10.94-27.04-10.94-15.82 0-26.52 10.82-10.7 10.81-10.7 26.8t10.7 26.92q10.7 10.94 26.52 10.94Zm483.91-282.26q15.31 0 25.96-10.59t10.65-26.24q0-15.65-10.59-26.58-10.59-10.94-26.24-10.94-15.65 0-26.58 10.85-10.94 10.85-10.94 26.89 0 15.56 11.22 26.08 11.22 10.53 26.52 10.53Zm.57 526.22ZM198.87-480Zm483.39-281.7Z"/></svg>
                        </div>
                    </div>
                    <div class="action-2">
                        <div class="title">
                            <h1>Files</h1>
                            <span>________________________________________________________</span>
                        </div>
                        <div class="files">
                            <a href="yourfile.pdf" download><span>Neural source code download</span> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-326.78 252.87-553.91l74.65-75.53L427-529.39v-289.83h106v289.83l99.48-100.05 74.65 75.53L480-326.78Zm-233.22 186q-44.3 0-75.15-30.85-30.85-30.85-30.85-75.15v-120h106v120h466.44v-120h106v120q0 44.3-30.85 75.15-30.85 30.85-75.15 30.85H246.78Z"/></svg></a>
                        </div>
                    </div>
                    <div class="action-3">
                        <div class="react">
                            <h1>Was this article helpful?</h1>
                            <div class="buttons">
                                <button class="yes-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M705.87-87.22H262.48V-628.7L534-900.22l64.87 58.93q9.09 8.25 15 23.07 5.91 14.83 5.91 29.22v7.78l-42.3 152.52h250.65q41.61 0 73.81 32.2 32.19 32.2 32.19 73.81v45.52q0 8.37-2 17.95-2 9.57-5.13 17.13L803.61-150.48q-11.83 26.79-39.89 45.02-28.07 18.24-57.85 18.24ZM360-193.22h345.87L827-477.17v-45.52H452.3L499.52-715 360-575.48v382.26Zm0-382.26v382.26-382.26Zm-97.52-53.22v106.01H160v329.47h102.48v106H54V-628.7h208.48Z"/></svg> Yes</button>
                                <button class="no-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M242.26-820.22h443.39v541.48L414.13-7.22l-64.87-58.92q-9.09-8.25-15-23.08-5.91-14.82-5.91-29.21v-7.79l42.3-152.52H120q-41.61 0-73.81-32.19Q14-343.13 14-384.74v-45.52q0-8.37 2-17.95 2-9.57 5.13-17.14l123.39-291.6q11.83-26.79 39.89-45.03 28.07-18.24 57.85-18.24Zm345.87 106H242.26L121.13-430.26v45.52h374.7l-47.22 192.3 139.52-139.52v-382.26Zm0 382.26v-382.26 382.26Zm97.52 53.22v-106h102.48v-329.48H685.65v-106h208.48v541.48H685.65Z"/></svg> No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
`
// End sample code

// Required modules
import { auth } from "https://www.roovix.com/config/firebase_config.js"
import { db } from "https://www.roovix.com/config/firebase_config.js"
import { ref, onValue, query, limitToFirst } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js"

document.addEventListener("DOMContentLoaded", ()=>{
    onValue(ref(db, 'users'), (data)=>{
        const value = data.val();
    });
});