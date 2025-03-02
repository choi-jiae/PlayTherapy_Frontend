# PlayTherapy Frontend

**PlayTherapy**는 **놀이치료사를 위한 놀이 치료 과정 개선 도움 시스템**으로, 융합연구학점제 수업에서 진행한 프로젝트입니다.

PlayTherapy가 제공하는 주요 기능은 다음과 같습니다.
- 아동 별 놀이치료 기록 관리 페이지(case) 생성
- 놀이치료 회기 별(session) 동영상 업로드 및 축어록 자동 생성
- 축어록 수정 및 놀이치료 영상 확인
- 축어록 다운로드
- 놀이치료 축어록 분석 리포트

## Use Case Diagram
![image](https://github.com/user-attachments/assets/2fa59463-cc21-4fea-add7-b6eff1827a09)

## Demo Video



https://github.com/user-attachments/assets/eaf2f54b-32b3-4a8a-9645-91170aff20c6


https://github.com/user-attachments/assets/4b9a5ad4-605a-453c-a1a6-30ee8cdb3025


개발에 참여한 부분만 이 레포지토리에 남겨두어 실제 시스템 실행 시 화면과 영상의 화면이 다를 수 있습니다.  

## Dev Environment
github action으로 docker 이미지 빌드 및 배포 작업을 수행하였고, argocd를 사용하여 Kubernetes 클러스터 관리를 하였습니다.
|argocd applications|frontend(alpha ver.)|
|:---:|:---:|
| ![image](https://github.com/user-attachments/assets/84567836-d7cb-4a51-87da-836d45f0c148) | ![image](https://github.com/user-attachments/assets/cfd48a73-6ef3-4668-98e3-3e560e97b0fb) |

## Getting Started

1. install package

```bash
npm install
```

2. run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
