// Danny Schreiter 2024 // www.d9s.de
// built using p5.js - see https://p5js.org/

let version = "1.11";
let display_mode = 0;         // 0 -black background // 1 - colored background
let outer_margin = 0.05;      // 5% margin to all sides

let total_width = 400, total_height = 400;
let number_of_boxes = 1, number_of_words = 1, max_number_of_words = 90, OffsetA = 100, OffsetB = 200;
let error_sum = 0; let minimal_error_sum = 1000; let max_tries = 500;
let text_obj = []; let box_obj = [];
let last_string = "", next_string = "";
let change_timer = 0, touch_timer_1 = 0, touch_timer_2 = 0, status_timer = 0;
let redraw_trigger = false, fs = false;
let lastPos = 0, altX = 0, altY = 0, dirX = 0, dirY = 0, fs_trigger = 0;

function preload() {
  font1 = loadFont('./fonts/DancingScript-Regular.ttf');
  font2 = loadFont('./fonts/LovedbytheKing-Regular.ttf'); 
  font3 = loadFont('./fonts/RockSalt-Regular.ttf');
  font4 = loadFont('./fonts/GiveYouGlory-Regular.ttf');
  font5 = loadFont('./fonts/AveriaSansLibre-Regular.ttf');
}

function setup() {
  total_width = windowWidth;
  total_height = windowHeight;
  createCanvas(total_width, total_height);
  textAlign(LEFT, TOP);

  last_string = generate_time_string();
  ceate_design_from_string(last_string);

  all_fade_in();
}

function draw() {
  background(0);

  if(millis() > status_timer)                   // wait for statusmessage to dissapear (if necessary)
    next_string = generate_time_string(); 

  if(next_string != last_string || redraw_trigger)
    {
      last_string = next_string; 
      redraw_trigger = false;

      for(let i = 1; i <= number_of_words; i++) {       // let the old text disappear
        text_obj[i].fade_out = millis() + i*400 + 2000;   
      }

      change_timer = millis() + number_of_words*400 + 2000;
    }

  if(millis() > change_timer && change_timer != 0)      // change text
    {
      change_timer = 0;
      ceate_design_from_string(last_string);

      all_fade_in();      
    }


  for(i = 1; i <= number_of_words; i++) {               // draw the new text
    text_obj[i].draw_text_with_padding(box_obj[i].posX,box_obj[i].posY,box_obj[i].width,box_obj[i].height,10);
  }
}


function all_fade_in()
{
  for(let i = 1; i <= number_of_words; i++) {
    text_obj[i].fade_in = millis() + i*400 + 2000;   
  }
}

function ceate_design_from_string(whole_string) {           

  // delete old text objects (if necessary)
  for(i = 1; i <= max_number_of_words; i++) {                            
    if (typeof text_obj[i] != "undefined") 
      delete text_obj[i];
  }

  let words = split(whole_string," ");

  for (let i = 0; i < min(words.length, max_number_of_words); i++) {  
    text_obj[i+1] = new text_box(words[i]);
    number_of_words = i+1;
    console.log(words[i]);
  }


  minimal_error_sum = 1000;

  for(let attempts = 1; attempts < max_tries; attempts++)                  // try to find the best possible arrangement
    {
      reorder_boxes();
      if(error_sum < minimal_error_sum )                                   // found better arrangement than last one?            
        {
          minimal_error_sum = error_sum;

          for(i = 1; i <= max_number_of_words; i++) {                      // delete old arrangement
            if (typeof box_obj[i] != "undefined") 
              delete box_obj[i];
          }

          for(i = 1; i <= number_of_words; i++) {                           
            box_obj[i] = new rect_box(box_obj[i + OffsetA].posX,box_obj[i + OffsetA].posY,box_obj[i + OffsetA].width,box_obj[i + OffsetA].height,box_obj[i + OffsetA].order,box_obj[i + OffsetA].iteration);
          }          
        }
    }

}


function reorder_boxes()                                                 // find a new (random) arrangement of rectangles
{
  for(i = 1; i <= max_number_of_words; i++) {                            // delete old objects (if necessary)
    if (typeof box_obj[i+ OffsetA] != "undefined") 
      delete box_obj[i+ OffsetA];
    if (typeof box_obj[i+ OffsetB] != "undefined") 
      delete box_obj[i+ OffsetB];       
  }

  box_obj[1+OffsetB] = new rect_box(total_width*outer_margin,total_height*outer_margin,total_width*(1-2*outer_margin), total_height*(1-2*outer_margin), 1);    // create first box, as big as the visible screen
  number_of_boxes = 1;

  while(number_of_boxes < number_of_words)
    {
      let no = 1, gr = 0;
      for(let i = 1; i <= number_of_boxes; i++)
        {
          if(box_obj[i+OffsetB].mass > gr)
            {
              no = i; gr = box_obj[i+OffsetB].mass;
            }
        }
        // no is now the id of the biggest rectangle - which will now be divided

        if(box_obj[no+OffsetB].aspect_ratio > 2)      // split wide rectangles vertically
          {
              let split_at = random(0.3 * box_obj[no+OffsetB].width, 0.7 * box_obj[no+OffsetB].width);
              let alteBreite = box_obj[no+OffsetB].width;

              let iteration_depth = box_obj[no+OffsetB].iteration;
              box_obj[no+OffsetB].width = split_at;
              box_obj[no+OffsetB].iteration = iteration_depth + 1;
              box_obj[no+OffsetB].calculate();

              box_obj[number_of_boxes+1+OffsetB] = new rect_box(box_obj[no+OffsetB].posX + box_obj[no+OffsetB].width, box_obj[no+OffsetB].posY, alteBreite - box_obj[no+OffsetB].width, box_obj[no+OffsetB].height, iteration_depth + 1);
              number_of_boxes++;
          } else {                                // otherwise horizontally
            let split_at = random(0.3 * box_obj[no+OffsetB].height, 0.7 * box_obj[no+OffsetB].height);
            let alteHoehe= box_obj[no+OffsetB].height;
            let iteration_depth = box_obj[no+OffsetB].iteration;
            box_obj[no+OffsetB].height = split_at;
            box_obj[no+OffsetB].iteration = iteration_depth + 1;
            box_obj[no+OffsetB].calculate();
     
            box_obj[number_of_boxes+1+OffsetB] = new rect_box(box_obj[no+OffsetB].posX, box_obj[no+OffsetB].posY + box_obj[no+OffsetB].height, box_obj[no+OffsetB].width, alteHoehe - box_obj[no+OffsetB].height, iteration_depth + 1);    
            number_of_boxes++;           
          }

    }


    // re-order in order of reading

    for(i = 1; i <= number_of_boxes; i++) {                   
      let maxO = 999999;    let no = 1;
      for(j = OffsetB + 1; j <= OffsetB + number_of_boxes; j++) { 
        if(box_obj[j].order < maxO)
          {
            maxO = box_obj[j].order;
            no = j;
          }

      }

      box_obj[no].order+= 100000;
      box_obj[i + OffsetA] = new rect_box(box_obj[no].posX,box_obj[no].posY,box_obj[no].width,box_obj[no].height,box_obj[no].order,box_obj[no].iteration);
    }

    // calculate how well the words fit into this arrangemente
    error_sum = 1;
    for(i = 1; i <= number_of_boxes; i++) {
      let current_error = box_obj[i + OffsetA].aspect_ratio / text_obj[i].aspect_ratio;
      if(current_error < 1)
        current_error = 1 / current_error;
      error_sum = error_sum * current_error;
    }
}

class text_box {
  constructor(first_text) {
    this.font = font1;
    this.text = first_text;
    this.txtcolor = color(255,255,255,0);
    this.bgcolor = color(random(0,255),random(0,255),random(0,255),0);
    this.fade_in = 0;
    this.fade_out = 0;
    this.aspect_ratio = 1;
    this.max_scaling = 1;
    this.calculate();
    // choose font randomly
    switch(random([1,2,3,4,5])) {
      case 1: this.font = font1; break;
      case 2: this.font = font2; break;
      case 3: this.font = font3; break;
      case 4: this.font = font4; break;
      case 5: this.font = font5; break;      
    }
  }

  calculate() {
    push();
    textFont(this.font);
    let tbox = this.font.textBounds(this.text, 0, 0);
    this.aspect_ratio = tbox.w / tbox.h; 
    pop(); 
  }

  draw_text(posX, posY, breite, hoehe)        
  { 
    if(this.fade_in > millis())
      {
        this.txtcolor.setAlpha(map(millis(),this.fade_in - 2000,this.fade_in,0,255,true));
        this.bgcolor.setAlpha(map(millis(),this.fade_in - 2000,this.fade_in,0,200,true));
      }
    if(this.fade_out > millis())
      {
        this.txtcolor.setAlpha(map(millis(),this.fade_out - 2000,this.fade_out,255,0,true));
        this.bgcolor.setAlpha(map(millis(),this.fade_out - 2000,this.fade_out,200,0,true));
      }    

    push();
    textAlign(LEFT, TOP);
    textFont(this.font); textSize(20); fill(this.txtcolor);
    let tbox = this.font.textBounds(this.text, 0, 0);   

    let sw = breite / tbox.w;
    let sh = hoehe / tbox.h;  
  
    if(sw < sh)
      this.max_scaling = sw;
    else
      this.max_scaling = sh;  

    let relHoehe = tbox.h * this.max_scaling;
    let relBreite = tbox.w * this.max_scaling;    

    translate(posX, posY);
    scale(this.max_scaling);

    text(this.text, (breite / 2 - relBreite / 2) / this.max_scaling  - tbox.x, (hoehe / 2 - relHoehe  / 2) / this.max_scaling - tbox.y); 
    pop();
  }

  draw_text_with_padding(posX, posY, w, h, pad_pc)                  // last argument: padding (in percentage)
  {
    if(display_mode == 1)                                      // show colored boxes (if wanted)
      {
        push(); 
        fill(this.bgcolor); stroke(0,0);
        rect(posX, posY, w, h);
        pop();
      }

    this.draw_text(posX + (pad_pc / 100)*w, posY + (pad_pc / 100)*h, (1 - pad_pc / 50)*w, (1 - pad_pc / 50)*h)
  }
}



class rect_box {
  constructor(posx, posy, w, h, iteration_depth) {
    this.posX = posx;
    this.posY = posy;
    this.width = w;
    this.height = h;
    this.col = color(random(0,255),random(0,255),random(0,255),100);
    this.aspect_ratio = 1;
    this.mass = 1;
    this.order = 0;
    this.iteration = iteration_depth;
    this.calculate();
  }

  calculate() {
    this.aspect_ratio = this.width / this.height;   
    this.mass = this.width+this.height;                      // a measure of size
    this.order = this.posY + ((this.posX) / 3) + 10000;      // this helps to find the right reading order
  }

  draw_text() {
    push();
    fill(this.col);
    stroke(0,0);
    if(display_mode == 1) {
      rect(this.posX,this.posY,this.width,this.height);
    }
    pop();
  }

    /*
  markieren(no){
    push();
    fill(0);textSize(10);
    rect(no,this.posX,this.posY);
    pop();
  }
      */
}


function windowResized() { 
  total_width = windowWidth;
  total_height = windowHeight;
  resizeCanvas(total_width, total_height);   

  last_string = generate_time_string();
  ceate_design_from_string(last_string);

  all_fade_in();
} 


function keyPressed() {       
  switch(keyCode)
  {
    case 67: display_mode = 1 - display_mode; break;                                             // c ... color
    case 82: redraw_trigger = true;  break;                                                      // r ... redraw  
    case 70: fs = fullscreen(); fullscreen(!fs); break;                                          // f ... fullscreen
    case 86: next_string = "Version " + version; status_timer = millis() + 15000; break;         // v ... show version number
  }
}


function touchMoved() { 
  if(millis() - lastPos > 100)      // too long ago?
  {
    lastPos = millis();
    altX = mouseX;
    altY = mouseY; 
    return false;
  }    

  if(millis() - lastPos > 20)      // too short?
    {      
      var dirX = floor(mouseX - altX);
      var dirY = floor(mouseY - altY);
      lastPos = millis();
      altX = mouseX;
      altY = mouseY;  
      
      if(abs(dirX) + abs(dirY) < 20)      // touch movement not wide enough?
        return false;
      
      if(abs(dirX)>abs(dirY))
        {
          if(dirX>0)                      // swiping right/left -> color on/off
            display_mode = 1;
          else
            display_mode = 0;    
        }
      else
        {
          if(dirY>0)                      // swiping up/down -> toggle fullsize mode
            fs_trigger = 2;
          else
            fs_trigger = 1;     
        }        
    }
  return false;   
}

function touchEnded() {
  if(fs_trigger == 1)
    fullscreen(true); 
  if(fs_trigger == 2)
    fullscreen(false);
  fs_trigger = 0;
  return false;
}
