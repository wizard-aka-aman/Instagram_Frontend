import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-display-saved',
  templateUrl: './display-saved.component.html',
  styleUrls: ['./display-saved.component.scss']
})
export class DisplaySavedComponent implements OnInit {
  username: string = "";
  email: string = "";
  fullname: string = ""; 
  numberposts: number = 0;
  followers: number = 0;
  following: number = 0;
  bio: string = "";
  avatarUrl: string = '';
  plusIconUrl: string = 'assets/plus.png';
  activeTab = 'saved';
  isSavedAvailable = false;
  fullDetailPost: any;
  selectedPost: any = null;
  newComment: string = '';
  loggedInUserName : string ="";
  followForm={
    followerUsername : '',
    followingUsername: ''
  }
  follower :any;
  followingdata :any;
  alreadyFollowing = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('closeModal') closeModal!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputPost') fileInputPost!: ElementRef<HTMLInputElement>;
  constructor(private Service: ServiceService, private route: ActivatedRoute , private router: Router) {
    this.email = this.Service.getEmail();
  } 
  ngOnInit(): void {
  this.loggedInUserName = this.Service.getUserName();

  this.route.paramMap.subscribe(params => {
    this.username = String(params.get('username'));
    if (this.username) {
      this.getProfile(this.username);
      this.GetSaved(); // ✅ Add this line to fetch posts again
    }

    if (this.loggedInUserName != this.username) {
      this.isFollowing();
    }
  });

}
  isFollowing(){
     this.Service.isFollowing(this.loggedInUserName,this.username).subscribe({
      next: (data:any) => {
        console.log(data);
        this.alreadyFollowing = data;
      },
      error: (error) => {
        console.error(error);
      }
        
    })
  }
  GetSaved() {
     this.fullDetailPost = []
     this.Service.GetAllPostByUsername(this.username).subscribe({
      next: (data: any) => {
        console.log(data); 
          this.numberposts = data.length; 
      },
      error: (error) => {
        console.log(error);
      }
    })
    this.Service.GetAllSavedByUserName(this.username).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data.length == 0) {
          this.isSavedAvailable = false;
          this.numberposts = data.length;
        } else {
          this.numberposts = data.length;

          this.isSavedAvailable = true;
          this.fullDetailPost = data
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  getProfile(username: string) {
    this.Service.GetProfileByUserName(username).subscribe({
      next: (data: any) => {
        console.log(data);
        this.fullname = data.fullName;
        this.bio = data.bio;
        this.following = data.followingCount
        this.followers = data.followersCount;
        if (data.profilePicture == null) {
          this.avatarUrl = 'assets/avatar.png';
        } else {
          this.avatarUrl = "data:image/jpeg;base64,"+data.profilePicture;
        }
      },
      error: (error: any) => {
        console.log(error);
       this.router.navigateByUrl('/not-found', { skipLocationChange: true });
      }
    });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  close() {
    this.closeModal.nativeElement.click();
  }

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const fData = new FormData();
      fData.append('filecollection', file); // must match parameter name in backend 
      console.log(fData);

      // TODO: Upload logic here (send to backend, etc.)
      this.Service.UploadProfilePicture(this.username, fData).subscribe({
        next: (res: any) => {
          console.log(res);
          this.close();
          this.getProfile(this.username);
        },
        error: (err) => {
          console.log(err);
          this.close();
        }
      })
    }
  }
  GetFollowers(){
    this.Service.GetFollower(this.username).subscribe({
      next: (res:any)=>{
        console.log(res);
        this.follower = res;   
      },
      error : (err:any)=>{
        console.log(err);
        
      }
    })
    
  }
  GetFollowing(){
    this.Service.GetFollowing(this.username).subscribe({
      next: (res:any)=>{
        console.log(res);
        this.followingdata = res;   
      },
      error : (err:any)=>{
        console.log(err);
        
      }
    })
    
  }
  removePhoto() {
    this.Service.RemoveProfilePicture(this.username).subscribe({
      next: (res: any) => {
        console.log(res);
        this.close();
        this.getProfile(this.username);
      },
      error: (err) => {
        console.log(err);
        this.close();
      }
    })
  }
  openPostPage(postId: number) {
    this.router.navigate([`/${this.username}/p/${postId}`]);
  }
  Follow(){
    this.followForm.followerUsername = this.loggedInUserName
    this.followForm.followingUsername = this.username;
    console.log(this.followForm);
    
    this.Service.FollowPost(this.followForm).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getProfile(this.username);
         this.isFollowing();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  UnFollow(){
    this.followForm.followerUsername = this.loggedInUserName
    this.followForm.followingUsername = this.username;
    console.log(this.followForm);
    
    this.Service.UnFollowPost(this.followForm).subscribe({
      next: (res: any) => {
        console.log(res);
        this.getProfile(this.username);
         this.isFollowing();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
    getProfileImage(image: string | null): string {
    if (!image || image === 'null') {
      return 'assets/avatar.png';
    }
    return 'data:image/jpeg;base64,' + image;
  }
}
