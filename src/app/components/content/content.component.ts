import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  commentsVisible = false; // This variable tracks the visibility of the comments

  // Sample data for posts and comments
  postImageUrl = 'path-to-your-image.jpg'; // Replace with actual image path if needed

  // Sample poster data
  poster = {
    name: 'Alice Brown',
    profileIcon: 'path-to-poster-icon.jpg', // Replace with actual path to the poster's profile icon
    postText: 'This is a sample post message. The post discusses the recent developments in AI and how it is transforming industries across the globe. It’s fascinating to see how technology is evolving at such a rapid pace!'
  };

  comments = [
    { name: 'John Doe', text: 'This is the first comment', profileIcon: 'path-to-icon1.jpg' },
    { name: 'Jane Smith', text: 'This is the second comment', profileIcon: 'path-to-icon2.jpg' },
    { name: 'Mike Johnson', text: 'This is the third comment', profileIcon: 'path-to-icon3.jpg' }
  ];

  toggleComments() {
    this.commentsVisible = !this.commentsVisible;
  }
}
