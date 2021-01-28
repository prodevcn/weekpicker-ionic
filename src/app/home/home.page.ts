import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private toastCtrl: ToastController, private selector: WheelSelector) {}
  getWeek(str) {
    var dt = new Date(str);
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + 3 - (dt.getDay() + 6) % 7);
    var week1 = new Date(dt.getFullYear(), 0, 4);
    return 1 + Math.round(((dt.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }
  getDaysOfWeek(str) {
    var dt = new Date(str);
    var currentWeekDay = dt.getDay();
    var lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
    var weekDays = [];    
    for (var i = 0; i <= lessDays; i++) {
        var day = new Date(dt.getTime() - 60 * 60 * 24 * 1000 * (lessDays - i));
        weekDays[i] = day;
    }    
    for (var i = 0; i <= (6 - lessDays); i++ ) {
        var day = new Date(dt.getTime() + 60 * 60 * 24 *1000 * i);
        weekDays[(lessDays + i)] = day;
    }
    return weekDays;
  }
  getWeeks() {
    let weeks: any[] = [];
    let week = {
      description: '',
      dates: []
    }
    let dt = new Date();
    let currentWeekNumber = this.getWeek(String(dt));
    let currentWeekStart = this.getDaysOfWeek(String(dt))[0];
    let currentWeekLast = this.getDaysOfWeek(String(dt))[6];
    week.description = `Week ${currentWeekNumber} : ${String(currentWeekStart).slice(4, 15) } - ${String(currentWeekLast).slice(4, 15)}`;
    week.dates = this.getDaysOfWeek(String(dt));
    weeks[5] = week;
    for ( var i = 1; i <= 5; i ++) {
      var nWeek = {
        description: '',
        dates: []
      };
      var selectedWeekNumber;
      var selectedWeekStart;
      var selectedWeekLast;
      selectedWeekNumber = currentWeekNumber + i;
      selectedWeekStart = new Date(currentWeekStart.getTime() + 60*60*1000*24*7 * i);
      selectedWeekLast = new Date(currentWeekLast.getTime() + 60*60*1000*24*7 * i);
      nWeek.description = `Week ${selectedWeekNumber} : ${String(selectedWeekStart).slice(4, 15) } - ${String(selectedWeekLast).slice(4, 15)}`;
      nWeek.dates = this.getDaysOfWeek(String(selectedWeekStart));
      weeks[(5+i)] = nWeek;
      nWeek={
        description:'',
        dates: []
      };
      if(currentWeekNumber > i)
          selectedWeekNumber = currentWeekNumber - i;
      else
          selectedWeekNumber = currentWeekNumber - i + 53;
      selectedWeekStart = new Date(currentWeekStart.getTime() - 60*60*1000*24*7 * i);
      selectedWeekLast = new Date(currentWeekLast.getTime() - 60*60*1000*24*7 * i);
      nWeek.description = `Week ${selectedWeekNumber} : ${String(selectedWeekStart).slice(4, 15) } - ${String(selectedWeekLast).slice(4, 15)}`;
      nWeek.dates = this.getDaysOfWeek(String(selectedWeekStart));
      weeks[(5 - i)] = nWeek;
    }
    return weeks;
  }
  openPicker() {
    var weeks = this.getWeeks();
    console.log(weeks);
    this.selector.show({
      title: 'Select Week',
      positiveButtonText: 'Choose',
      negativeButtonText: 'Abort',
      items: [
        weeks
      ],
      defaultItems: [
        {index: 0, value: weeks[5].description}
      ]
    }).then(async (result) => {
      let msg = `Selected ${result[0].description}`;
      console.log(result[0]);
        let toast = await this.toastCtrl.create({
          message: msg,
          duration: 4000
        });
        toast.present();
    });
  }
}
