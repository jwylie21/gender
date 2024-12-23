
// DEFINE GLOBAL VARIABLES
let timeline = [];

// jsPsych Initialization
const jsPsych = initJsPsych({
  use_webaudio: false,
  display_element: 'jspsych-target',
  auto_preload: true,
  show_progress_bar: true,
  default_iti: 0,
  on_finish: function (data) {
    jsPsych.data.displayData('csv');
  }
});

const participantId = jsPsych.data.getURLVariable('PROLIFIC_PID');
const studyId = jsPsych.data.getURLVariable('STUDY_ID');
const sessionId = jsPsych.data.getURLVariable('SESSION_ID');

const filename = `${participantId}` + "_" + `${studyId}` + "_" + `${sessionId}.csv`;

// Randomize assignment of condition:
let genderCondition = jsPsych.randomization.sampleWithoutReplacement(['male', 'female'], 1)[0];


jsPsych.data.addProperties({
  participantId: participantId,
  studyId: studyId,
  sessionId: sessionId,
  genderCondition: genderCondition
});

// Define New Information and Update Trial
const newInformation = [
  "Lied about a co-worker's poor work ethic to their boss for personal gain",
  "Publicly mocked their sister for stuttering",
  "Tried to steal clothes from a department store but got caught by security",
  "Is known for flirting with friends' partners",
  "Lied to their employer about their productivity",
  "Lied to an investigator about a crime",
  "Initiated an argument with a friend in a crowded public space",
  "Feels entitled to a lot more than they get",
  "Lost their temper at the barista",
  "Is known for pointing out everyone's shortcomings",
  "Refused to attend the funeral of a relative they disliked",
  "Never picks up after their dog while out on a walk",
  "Waited to the last moment to cancel plans with a friend"
];

// Political Ideology
const politicalResponses = [
  "1 (Extremely liberal)",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 (Extremely conservative)",
];

// attention check
const attention_scale = [
  "1 = No, I didnt pay close attention. You should not use my data",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 = Yes, I paid full attention. You should use my data",
];

////////////////////////////////////////////////  FIRST PAGE
// ENTER FULLSCREEN 
const enterFullscreen = {
  type: jsPsychFullscreen,
  name: 'enter_fullscreen',
  fullscreen_mode: true,
  delay_after: 0
};

timeline.push(enterFullscreen)

////////////////////////////////////////////////////////// Second Page
// CONSENT FORM //
const consentForm = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'consent',
      prompt: `
            <p style="text-align:left;">
            Informed Consent Form for IRB Study #2019-0338
            Thank you for your interest in participating in our study!

            You are being asked to participate in this research study because you are at 
            least 18 years old and have self-selected to participate.
            
            </p>
            <p style="text-align: left;">
            
            The purpose of this research study is to test how social judgments interact with perception and cognition, 
            and whether specific pieces of information influence social judgments. 
            If you agree to participate, we will ask you to: (1) view a series of images, pictures, film clips, stories, 
            newspaper articles, or write about a time from your past; (2) complete a cognitive task in which you will 
            view a series of stimuli for a short period of time, recall or categorize them, sort pictures and words, 
            visually search a display of letters, a word/letter recognition task, or solve puzzles; 
            or (3) complete various personality, individual difference, and demographic questionnaires. In some cases, 
            you will skip the first step and simply begin the cognitive task.
            
            </p>
            <p style="text-align: left;">
            This experiment will take less than 10 minutes. 
            Participants do not receive compensation if they withdraw prior to completion 
            of the experiment. We do not anticipate any possible risks. 
            However, we will be presenting you with material that has emotional 
            qualities that may induce discomfort when viewing such material.

            </p>
            <p style="text-align: left;">
            The material may consist of scary animals, disgusting material, or repugnant material/themes/characters. 
            If you decide to participate, the information recorded will remain confidential, 
            and your identifying information will not be stored with your data.
            </p>
            <p style="text-align: left;">

            We will ask you general questions about your background, political beliefs, and other demographic data, 
            but no sensitive information will be asked or recorded. 
            The data is tied only to a non-descript subject ID, which will be the only subject identifying 
            information that we will use during data analyses. 
            Additionally, the websites used for data collection are password protected/encrypted.
            </p>
            
            <p style="text-align: left;">
            Your participation in this research is voluntary.

            </p>
            <p style="text-align: left;">
            
            If you have any questions, please contact Ana Gantman at ana.gantman@brooklyn.cuny.edu. 
            If you have any questions about your rights as a research participant or if you would 
            like to talk to someone other than the researchers, you can contact CUNY Research 
            Compliance Administrator at 646-664-8918 or HRPP@cuny.edu.

            </p>
            <p style="text-align: left;">
              If you agree to the statements above and agree to participate in this study,
              please select the “Consent given” button below to continue.
            </p>`,
      options: ["Consent not given", "Consent given"],
      horizontal: true,
      required: true
    }
  ],
  preamble: '<h2 style="text-align: center"><strong>Consent Form</strong></h2>',

  // If the participant does not consent, end the experiment
  on_finish: function (data) {
    if (jsPsych.data.get().last(1).values()[0].response.consent == "Consent not given") {
      jsPsych.endExperiment(
        `<p class="jspsych-center">
          You did not consent to participate in this study.<br>
          Please return this study in Prolific.
        </p>`
      );
    }
  }
};

timeline.push(consentForm);

///////////////////////////////////////////////////// THIRD PAGE - FIFTH PAGE
// Define Instructions
const instructions = {
  type: jsPsychInstructions,
  pages: [
    `<div style="margin-top: 100px; text-align: center;">
       <p>Welcome to the study. In this experiment, you'll be asked to make judgments about people based on very limited information.</p>
     </div>`,
    `<div style="margin-top: 100px; text-align: center;">
       <p>You will use a slider scale to indicate your responses to both questions. Please click 'Next' to begin.</p>
     </div>`
  ],
  show_clickable_nav: true
};

const instructions_step2 = {
  type: jsPsychInstructions,
  pages: [
    `<div style="margin-top: 100px; text-align: center;">
       <p>Next, you will see an action. Please consider how this new information would affect your judgment of the person you just rated. The slider will start at your last rating.</p>
     </div>`
  ],
  show_clickable_nav: true
};

// Build Timeline
timeline.push(instructions);

// Define Morality Slider Trial

// Initialize Global Variable for Last Slider Response
let lastMoralitySliderValue = []; // Indicates no value set yet

// First Slider Trial
const moralitySlider = {
  type: jsPsychHtmlSliderResponse,
  stimulus: function () {
    return `<div style="margin-top: 100px; text-align: center;">
      <p>How morally good or bad do you think the <b>average ${
        genderCondition === 'male' ? 'man' : 'woman'
      }</b> is?</p>
    </div>`;
  },
  labels: ['Extremely morally bad', 'Neutral', 'Extremely morally good'],
  min: 0,
  max: 100,
  start: 50, // Default starting value
  data: { trial_type: "morality_slider" },
  on_finish: function (data) {
    lastMoralitySliderValue = data.response; // Save the slider response globally
  }
};


// Second Slider Trial
const infoTrial = {
  type: jsPsychHtmlSliderResponse,
  stimulus: function () {
    const randomInfo = jsPsych.randomization.sampleWithoutReplacement(newInformation, 1)[0];
    return `<p>Now imagine that the <b>average ${
        genderCondition === 'male' ? 'man' : 'woman'
      }</b> did the following action:</p>
      <p><strong>${randomInfo}</strong></p>
      <p>How morally good or bad do you think this person is now?</p>`;
  },
  labels: ['Extremely morally bad', 'Neutral', 'Extremely morally good'],
  min: 0,
  max: 100,
  slider_start: function () {
    return lastMoralitySliderValue !== null ? lastMoralitySliderValue : 50; // Default to 50 if undefined
  },
  data: { trial_type: "info_slider" }
};

// Build Timeline
timeline.push(moralitySlider);
timeline.push(instructions_step2);
timeline.push(infoTrial); 

/////////////////////////////////////////////// SIXTH PAGE 
// DEMOGRAPHICS
const demographicsQuestions = {
  type: jsPsychSurveyHtmlForm,
  preamble: `<p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  html: `
        <!-- Age -->
        <div class="jspsych-survey-multi-choice-question">
          <label for="age">How old are you?</label><br>
          <input type="number" id="age" name="age" min="18" max="100" style="padding: 5px; width: 40px;" class="incomplete" oninput="this.classList.remove('incomplete');">
        </div>
        
        <!-- Race/Ethnicity -->
        <div class="jspsych-survey-multi-choice-question">
          <legend>Please indicate how you identify yourself:</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-indigenous" name="race-ethnicity-indigenous" value="Indigenous American or Alaskan Native" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-indigenous">Indigenous American or Alaskan Native</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-asian" name="race-ethnicity-asian" value="Asian or Asian-American" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-asian">Asian or Asian-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-black" name="race-ethnicity-black" value="African or African-American" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-black">African or African-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-native" name="race-ethnicity-native" value="Native Hawaiian or other Pacific Islander" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-native">Native Hawaiian or other Pacific Islander</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-white" name="race-ethnicity-white" value="White" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-white">White</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-hispanic" name="race-ethnicity-hispanic" value="Hispanic/Latino/a/e/x" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-hispanic">Hispanic/Latino/a/e/x</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-other" name="race-ethnicity-other" value="Other" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-prefer-not" name="race-ethnicity-prefer-not" value="Prefer not to disclose" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-prefer-not">Prefer not to disclose</label>
          </div>
        </div>

        <!-- Gender -->
        <div class="jspsych-survey-multi-choice-question">
          <legend>With which gender do you most closely identify?</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-man" name="gender" value="Man" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-man">Man</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-woman" name="gender" value="Woman" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-woman">Woman</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-non-binary" name="gender" value="Non-binary" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-non-binary">Non-binary</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-other" name="gender" value="Other" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-prefer-not" name="gender" value="Prefer not to disclose" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-prefer-not">Prefer not to disclose</label>
          </div>
        </div>

        <!-- Education -->
        <div class="jspsych-survey-multi-choice-question">
          <legend>
            What is the highest level of education you have received? 
            (If you are currently enrolled in school, please indicate the highest degree you have received)
          </legend>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-less-high-school" name="education" value="Less than a high school diploma" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-less-high-school">
              Less than a high school diploma
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-high-school" name="education" value="High school degree or equivalent (e.g. GED)" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-high-school">
              High school degree or equivalent (e.g. GED)
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-some-college" name="education" value="Some college, no degree" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-some-college">
              Some college, no degree
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-associate" name="education" value="Associate Degree (e.g. AA, AS)" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-associate">
              Associate Degree (e.g. AA, AS)
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-bachelors" name="education" value="Bachelor's Degree (e.g. BA, BS)" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-bachelors">
              Bachelor's Degree (e.g. BA, BS)
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-postgraduate" name="education" value="Postgraduate Degree (e.g. Master's Degree, Professional Degree, Doctorate Degree)" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-postgraduate">
              Postgraduate Degree (e.g. Master's Degree, Professional Degree, Doctorate Degree)
            </label>
          </div>
        </div>
        
        <style id="jspsych-survey-multi-choice-css">
          .jspsych-survey-multi-choice-question { 
            margin-top: 2em; 
            margin-bottom: 2em; 
            text-align: left; 
          } .jspsych-survey-multi-choice-option { 
            font-size: 10pt; 
            line-height: 2; 
          } .jspsych-survey-multi-choice-horizontal 
            .jspsych-survey-multi-choice-option { 
            display: inline-block; 
            margin-left: 1em; 
            margin-right: 1em; 
            vertical-align: top; 
            text-align: center; 
          } label.jspsych-survey-multi-choice-text input[type='radio'] {
            margin-right: 1em;
          }
        </style>
      `,
  button_label: 'Next',
  on_finish: function (data) {
    let demographicsData = data.response;

    // Age
    const age = Number(demographicsData['age']);

    // Gender
    let gender = demographicsData['gender'] || '';

    // Create a new object with the formatted data
    demographicsData = {
      age: age,
      race_ethnicity_indigenous: demographicsData['race-ethnicity-indigenous'] || '',
      race_ethnicity_asian: demographicsData['race-ethnicity-asian'] || '',
      race_ethnicity_black: demographicsData['race-ethnicity-black'] || '',
      race_ethnicity_native: demographicsData['race-ethnicity-native'] || '',
      race_ethnicity_white: demographicsData['race-ethnicity-white'] || '',
      race_ethnicity_hispanic: demographicsData['race-ethnicity-hispanic'] || '',
      race_ethnicity_other: demographicsData['race-ethnicity-other'] || '',
      race_ethnicity_na: demographicsData['race-ethnicity-prefer-not'] || '',
      gender: gender,
      education: demographicsData['education'] || ''
    };
    jsPsych.data
    .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
    .addToAll(demographicsData);
  }
};

timeline.push(demographicsQuestions);

const politicsQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'political-ideology-economic',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>economic</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-social',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>social</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-overall',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your <strong>overall</strong> political beliefs?
            </p>`,
      options: politicalResponses,
      horizontal: true
    }
  ],
  preamble: `
        <p class="jspsych-survey-multi-choice-preamble">
          Please answer the following questions about your political ideology:
        </p>`,
  request_response: true,
  on_finish: function (data) {
    let politicalData = data.response;

    politicalData = {
      political_ideology_economic: politicalData['political-ideology-economic'],
      political_ideology_social: politicalData['political-ideology-social'],
      political_ideology_overall: politicalData['political-ideology-overall']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(politicalData);
  }
};

timeline.push(politicsQuestions);

// attention check question

var attentioncheck = {
  type: jsPsychSurveyLikert,
  questions: [
    {prompt: "Did you pay attention while completing this study?", name: 'attentioncheck', labels: attention_scale, required: true},
  ],
  preamble:"Please answer the following question honestly. Your response will NOT affect whether or not you get paid.",
  randomize_question_order: true,
  required: true,
  on_finish: function(data) {
    let attentionData = data.response;

    attentionData = {
      attention_check: attentionData['attentioncheck']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(attentionData);
  }
};

timeline.push(attentioncheck);

// Comments
const feedback = {
  type: jsPsychSurveyText,
  questions: [
    {
      name: 'feedback',
      prompt:
        `<p class="jspsych-survey-multi-choice-question" style='text-align: "center !important;"'>
          Please leave any additional comments or feedback here.
        </p>`,
      rows: 10
    }
  ],
  on_finish: function (data) {
    let purposeFeedbackData = data.response;

    purposeFeedbackData = {
      feedback: purposeFeedbackData['feedback']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(purposeFeedbackData);
  }
}

timeline.push(feedback);

// Exit fullscreen
const exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0
};

timeline.push(exitFullscreen);

// DataPipe conclude data collection
const save_data = {
   type: jsPsychPipe,
   action: "save",
   experiment_id: "HgPpN2eeFI0Q", //updated as of dec 19
   filename: filename,
   data_string: () => jsPsych.data.get().csv(),
   on_finish: function (data) {
     function countdown(start, end) {
       const timer = setInterval(function() {
         if (start <= end) {
           clearInterval(timer);
         } else {
           start--;
           document.getElementById("countdown").innerHTML = start;
        }
      }, 1000);
     }
    
     countdown(5, 0);

     jsPsych.endExperiment(
      `<p class="jspsych-center">
         Thanks for participating! You will be redirected in <span id="countdown">5</span> seconds.
       </p>`
     );
     setTimeout(function () {
       window.location.href = "https://app.prolific.com/submissions/complete?cc=CM39EODG"; //this is updated as of cec 19 for pilot
     }, 5000)
   }
 };

timeline.push(save_data);

startExperiment();

// Function to initialize the experiment; will be called once all images are preloaded
function startExperiment() {
  jsPsych.run(timeline);
};