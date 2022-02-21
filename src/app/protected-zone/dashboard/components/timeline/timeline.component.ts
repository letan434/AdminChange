import { Component, Input, OnInit } from '@angular/core';
import { DashboardProject } from '@app/shared/models';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
    data: any;
    @Input() dataProject: DashboardProject;

    constructor() {

    }

    ngOnInit() {
        console.log(this.dataProject);

        this.data = {
            labels: ['BackLog','Progress','Done'],
            datasets: [
                {
                    data: [this.dataProject.taskBackLog, this.dataProject.taskProgress, this.dataProject.taskDone],
                    backgroundColor: [
                        "#0D62D1",
                        "#F0ED62",
                        "#0FD108"
                    ],
                    hoverBackgroundColor: [
                        "#0D62D1",
                        "#F0ED62",
                        "#0FD108"
                    ]
                }]
            };
    }
}
