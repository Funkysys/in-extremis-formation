# Documentation des Queries & Mutations GraphQL

---

## Queries Utilisateur

### `me`
**Variables attendues :**  
Aucune

**Exemple d’appel :**
```graphql
query {
  me {
    id
    email
    fullName
    isOauth
    isActive
    isSuperuser
    createdAt
    updatedAt
    oauthAccounts {
      id
      provider
      provider_account_id
      access_token
      refresh_token
      expires_at
      created_at
      updated_at
    }
  }
}
```

---

### `users`
**Variables attendues :**  
Aucune

**Exemple d’appel :**
```graphql
query {
  users {
    id
    email
    fullName
    isOauth
    isActive
    isSuperuser
    createdAt
    updatedAt
    oauthAccounts {
      id
      provider
      provider_account_id
      access_token
      refresh_token
      expires_at
      created_at
      updated_at
    }
  }
}
```

---

### `user`
**Variables attendues :**
```json
{
  "id": "UUID"
}
```

**Exemple d’appel :**
```graphql
query($id: UUID!) {
  user(id: $id) {
    id
    email
    fullName
    isOauth
    isActive
    isSuperuser
    createdAt
    updatedAt
    oauthAccounts {
      id
      provider
      provider_account_id
      access_token
      refresh_token
      expires_at
      created_at
      updated_at
    }
  }
}
```

---

## Queries Course

### `courses`
**Variables attendues :**
```json
{
  "published_only": "Boolean (optionnel, défaut: true)"
}
```

**Exemple d’appel :**
```graphql
query {
  courses {
    id
    title
    description
    cover_image {
      id
      url
      alt_text
      publicId
      width
      height
      format
      created_at
      updated_at
    }
    published
    created_at
    updated_at
    chapters {
      id
      title
      description
      order
      created_at
      updated_at
    }
    videos {
      id
      title
      description
      url
      duration
      order
      thumbnail {
        id
        url
        alt_text
      }
      markers {
        id
        label
        time
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
}
```

---

### `course`
**Variables attendues :**
```json
{
  "id": "UUID"
}
```

**Exemple d’appel :**
```graphql
query($id: UUID!) {
  course(id: $id) {
    id
    title
    description
    cover_image {
      id
      url
      alt_text
      publicId
      width
      height
      format
      created_at
      updated_at
    }
    published
    created_at
    updated_at
    chapters {
      id
      title
      description
      order
      created_at
      updated_at
    }
    videos {
      id
      title
      description
      url
      duration
      order
      thumbnail {
        id
        url
        alt_text
      }
      markers {
        id
        label
        time
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
}
```

---

## Queries Comment

### `course_comments`
**Variables attendues :**
```json
{
  "course_id": "String"
}
```

**Exemple d’appel :**
```graphql
query($course_id: String!) {
  course_comments(course_id: $course_id) {
    id
    content
    user_id
    course_id
    parent_id
    created_at
    updated_at
    user {
      id
      email
      fullName
      isOauth
      isActive
      isSuperuser
      createdAt
      updatedAt
      oauthAccounts {
        id
        provider
        provider_account_id
        access_token
        refresh_token
        expires_at
        created_at
        updated_at
      }
    }
    replies {
      id
      content
      user_id
      course_id
      parent_id
      created_at
      updated_at
      user {
        id
        email
        fullName
        isOauth
        isActive
        isSuperuser
        createdAt
        updatedAt
        oauthAccounts {
          id
          provider
          provider_account_id
          access_token
          refresh_token
          expires_at
          created_at
          updated_at
        }
      }
      replies {
        id
        content
        user_id
        course_id
        parent_id
        created_at
        updated_at
      }
    }
  }
}
```

---

### `comment`
**Variables attendues :**
```json
{
  "id": "String"
}
```

**Exemple d’appel :**
```graphql
query($id: String!) {
  comment(id: $id) {
    id
    content
    user_id
    course_id
    parent_id
    created_at
    updated_at
    user {
      id
      email
      fullName
      isOauth
      isActive
      isSuperuser
      createdAt
      updatedAt
      oauthAccounts {
        id
        provider
        provider_account_id
        access_token
        refresh_token
        expires_at
        created_at
        updated_at
      }
    }
    replies {
      id
      content
      user_id
      course_id
      parent_id
      created_at
      updated_at
    }
  }
}
```

---

## Queries Image

### `images`
**Variables attendues :**
```json
{
  "folder": "String (optionnel)"
}
```

**Exemple d’appel :**
```graphql
query {
  images {
    id
    url
    alt_text
    publicId
    width
    height
    format
    created_at
    updated_at
  }
}
```

---

### `image`
**Variables attendues :**
```json
{
  "id": "UUID"
}
```

**Exemple d’appel :**
```graphql
query($id: UUID!) {
  image(id: $id) {
    id
    url
    alt_text
    publicId
    width
    height
    format
    created_at
    updated_at
  }
}
```

---

## Queries Purchase

### `subscription_plans`
**Variables attendues :**
Aucune

**Exemple d’appel :**
```graphql
query {
  subscription_plans {
    id
    name
    description
    price
    interval
    features
    created_at
    updated_at
  }
}
```

---

### `subscription_plan`
**Variables attendues :**
```json
{
  "id": "UUID"
}
```

**Exemple d’appel :**
```graphql
query($id: UUID!) {
  subscription_plan(id: $id) {
    id
    name
    description
    price
    interval
    features
    created_at
    updated_at
  }
}
```

---

## Queries Video

### `bunny_videos`
**Variables attendues :**
Aucune

**Exemple d’appel :**
```graphql
query {
  bunny_videos {
    guid
    title
    date_uploaded
    views
    status
    thumbnail_url
    direct_play_url
    length
  }
}
```

---

### `bunny_video`
**Variables attendues :**
```json
{
  "guid": "String"
}
```

**Exemple d’appel :**
```graphql
query($guid: String!) {
  bunny_video(guid: $guid) {
    guid
    title
    date_uploaded
    views
    status
    thumbnail_url
    direct_play_url
    length
  }
}
```

---

## Queries Role

### `roles`
**Variables attendues :**
Aucune

**Exemple d’appel :**
```graphql
query {
  roles {
    id
    name
    description
  }
}
```

---

### `role`
**Variables attendues :**
```json
{
  "id": "String"
}
```

**Exemple d’appel :**
```graphql
query($id: String!) {
  role(id: $id) {
    id
    name
    description
  }
}
```

---

## Mutations Utilisateur

### `update_user_roles`
**Variables attendues :**
```json
{
  "userId": "UUID",
  "roles": ["String"]
}
```

**Exemple d’appel :**
```graphql
mutation($userId: UUID!, $roles: [String!]!) {
  update_user_roles(userId: $userId, roles: $roles) {
    user {
      id
      email
      fullName
      isOauth
      isActive
      isSuperuser
      createdAt
      updatedAt
      oauthAccounts {
        id
        provider
        provider_account_id
        access_token
        refresh_token
        expires_at
        created_at
        updated_at
      }
    }
    success
    error
  }
}
```

---

### `update_user`
**Variables attendues :**
```json
{
  "userId": "UUID",
  "data": {
    "email": "String",
    "full_name": "String",
    "is_active": "Boolean"
  }
}
```

**Exemple d’appel :**
```graphql
mutation($userId: UUID!, $data: UpdateUserInput!) {
  update_user(userId: $userId, data: $data) {
    user {
      id
      email
      fullName
      isOauth
      isActive
      isSuperuser
      createdAt
      updatedAt
      oauthAccounts {
        id
        provider
        provider_account_id
        access_token
        refresh_token
        expires_at
        created_at
        updated_at
      }
    }
    success
    error
  }
}
```

---

## Mutations Course

### `create_course`
**Variables attendues :**
```json
{
  "title": "String",
  "description": "String",
  "published": "Boolean"
}
```

**Exemple d’appel :**
```graphql
mutation($title: String!, $description: String!, $published: Boolean!) {
  create_course(title: $title, description: $description, published: $published) {
    id
    title
    description
    cover_image {
      id
      url
      alt_text
      publicId
      width
      height
      format
      created_at
      updated_at
    }
    published
    created_at
    updated_at
    chapters {
      id
      title
      description
      order
      created_at
      updated_at
    }
    videos {
      id
      title
      description
      url
      duration
      order
      thumbnail {
        id
        url
        alt_text
      }
      markers {
        id
        label
        time
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
}
```

---

### `update_course`
**Variables attendues :**
```json
{
  "id": "UUID",
  "title": "String",
  "description": "String",
  "published": "Boolean"
}
```

**Exemple d’appel :**
```graphql
mutation($id: UUID!, $title: String!, $description: String!, $published: Boolean!) {
  update_course(id: $id, title: $title, description: $description, published: $published) {
    id
    title
    description
    cover_image {
      id
      url
      alt_text
      publicId
      width
      height
      format
      created_at
      updated_at
    }
    published
    created_at
    updated_at
    chapters {
      id
      title
      description
      order
      created_at
      updated_at
    }
    videos {
      id
      title
      description
      url
      duration
      order
      thumbnail {
        id
        url
        alt_text
      }
      markers {
        id
        label
        time
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
}
```

---

### `delete_course`
**Variables attendues :**
```json
{
  "id": "UUID"
}
```

**Exemple d’appel :**
```graphql
mutation($id: UUID!) {
  delete_course(id: $id) {
    success
    error
  }
}
```

---

## Mutations Comment

### `create_comment`
**Variables attendues :**
```json
{
  "content": "String",
  "course_id": "String",
  "parent_id": "String (optionnel)"
}
```

**Exemple d’appel :**
```graphql
mutation($content: String!, $course_id: String!, $parent_id: String) {
  create_comment(content: $content, course_id: $course_id, parent_id: $parent_id) {
    id
    content
    user_id
    course_id
    parent_id
    created_at
    updated_at
    user {
      id
      email
      fullName
      isOauth
      isActive
      isSuperuser
      createdAt
      updatedAt
      oauthAccounts {
        id
        provider
        provider_account_id
        access_token
        refresh_token
        expires_at
        created_at
        updated_at
      }
    }
    replies {
      id
      content
      user_id
      course_id
      parent_id
      created_at
      updated_at
    }
  }
}
```

---

### `update_comment`
**Variables attendues :**
```json
{
  "id": "String",
  "content": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($id: String!, $content: String!) {
  update_comment(id: $id, content: $content) {
    id
    content
    user_id
    course_id
    parent_id
    created_at
    updated_at
    user {
      id
      email
      fullName
      isOauth
      isActive
      isSuperuser
      createdAt
      updatedAt
      oauthAccounts {
        id
        provider
        provider_account_id
        access_token
        refresh_token
        expires_at
        created_at
        updated_at
      }
    }
    replies {
      id
      content
      user_id
      course_id
      parent_id
      created_at
      updated_at
    }
  }
}
```

---

### `delete_comment`
**Variables attendues :**
```json
{
  "id": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($id: String!) {
  delete_comment(id: $id) {
    success
    error
  }
}
```

---

## Mutations Image

### `upload_image`
**Variables attendues :**
```json
{
  "file": "Upload!"
}
```

**Exemple d’appel :**
```graphql
mutation($file: Upload!) {
  upload_image(file: $file) {
    id
    url
    alt_text
    publicId
    width
    height
    format
    created_at
    updated_at
  }
}
```

---

### `delete_image`
**Variables attendues :**
```json
{
  "id": "UUID"
}
```

**Exemple d’appel :**
```graphql
mutation($id: UUID!) {
  delete_image(id: $id) {
    success
    error
  }
}
```

---

## Mutations Purchase

### `create_subscription`
**Variables attendues :**
```json
{
  "plan_id": "UUID",
  "user_id": "UUID"
}
```

**Exemple d’appel :**
```graphql
mutation($plan_id: UUID!, $user_id: UUID!) {
  create_subscription(plan_id: $plan_id, user_id: $user_id) {
    id
    user_id
    plan_id
    status
    start_date
    end_date
    created_at
    updated_at
  }
}
```

---

### `cancel_subscription`
**Variables attendues :**
```json
{
  "subscription_id": "UUID"
}
```

**Exemple d’appel :**
```graphql
mutation($subscription_id: UUID!) {
  cancel_subscription(subscription_id: $subscription_id) {
    success
    error
  }
}
```

---

## Mutations Video

### `upload_video`
**Variables attendues :**
```json
{
  "input": {
    "title": "String",
    "file_path": "String"
  }
}
```

**Exemple d’appel :**
```graphql
mutation($input: UploadVideoInput!) {
  upload_video(input: $input) {
    video {
      guid
      title
      date_uploaded
      views
      status
      thumbnail_url
      direct_play_url
      length
    }
    error
  }
}
```

---

### `delete_video`
**Variables attendues :**
```json
{
  "guid": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($guid: String!) {
  delete_video(guid: $guid) {
    success
    error
  }
}
```

---

## Mutations Role

### `create_role`
**Variables attendues :**
```json
{
  "name": "String",
  "description": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($name: String!, $description: String!) {
  create_role(name: $name, description: $description) {
    role {
      id
      name
      description
    }
    error
  }
}
```

---

### `assign_role`
**Variables attendues :**
```json
{
  "user_id": "String",
  "role_id": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($user_id: String!, $role_id: String!) {
  assign_role(user_id: $user_id, role_id: $role_id) {
    success
    error
  }
}
```

---

### `remove_role`
**Variables attendues :**
```json
{
  "user_id": "String",
  "role_id": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($user_id: String!, $role_id: String!) {
  remove_role(user_id: $user_id, role_id: $role_id) {
    success
    error
  }
}
```

---

## Mutations MagicLink

### `request_magic_link`
**Variables attendues :**
```json
{
  "email": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($email: String!) {
  request_magic_link(email: $email) {
    success
    error
  }
}
```

---

### `verify_magic_link`
**Variables attendues :**
```json
{
  "token": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($token: String!) {
  verify_magic_link(token: $token) {
    token
    error
  }
}
```

---

## Mutations Chapter

### `create_chapter`
**Variables attendues :**
```json
{
  "courseId": "UUID",
  "title": "String",
  "description": "String (optionnel)",
  "order": "Int (optionnel)",
  "imageId": "UUID (optionnel)"
}
```

**Exemple d’appel :**
```graphql
mutation($courseId: UUID!, $title: String!, $description: String, $order: Int, $imageId: UUID) {
  create_chapter(courseId: $courseId, title: $title, description: $description, order: $order, imageId: $imageId) {
    chapter {
      id
      title
      description
      order
      image {
        id
        url
        alt_text
        publicId
        width
        height
        format
        created_at
        updated_at
      }
      created_at
      updated_at
    }
    error
  }
}
```

---

### `create_video`
**Variables attendues :**
```json
{
  "chapterId": "UUID",
  "title": "String",
  "url": "String",
  "duration": "Int",
  "description": "String (optionnel)",
  "order": "Int (optionnel)",
  "thumbnailId": "UUID (optionnel)"
}
```

**Exemple d’appel :**
```graphql
mutation($chapterId: UUID!, $title: String!, $url: String!, $duration: Int!, $description: String, $order: Int, $thumbnailId: UUID) {
  create_video(chapterId: $chapterId, title: $title, url: $url, duration: $duration, description: $description, order: $order, thumbnailId: $thumbnailId) {
    video {
      id
      title
      url
      duration
      description
      order
      thumbnail {
        id
        url
        alt_text
        publicId
        width
        height
        format
        created_at
        updated_at
      }
      created_at
      updated_at
    }
    error
  }
}
```

---

### `create_video_marker`
**Variables attendues :**
```json
{
  "videoId": "UUID",
  "title": "String",
  "timestamp": "Int",
  "description": "String (optionnel)"
}
```

**Exemple d’appel :**
```graphql
mutation($videoId: UUID!, $title: String!, $timestamp: Int!, $description: String) {
  create_video_marker(videoId: $videoId, title: $title, timestamp: $timestamp, description: $description) {
    marker {
      id
      title
      description
      timestamp
      created_at
      updated_at
    }
    error
  }
}
```

---

### `update_video_marker`
**Variables attendues :**
```json
{
  "markerId": "UUID",
  "title": "String (optionnel)",
  "description": "String (optionnel)",
  "timestamp": "Int (optionnel)"
}
```

**Exemple d’appel :**
```graphql
mutation($markerId: UUID!, $title: String, $description: String, $timestamp: Int) {
  update_video_marker(markerId: $markerId, title: $title, description: $description, timestamp: $timestamp) {
    marker {
      id
      title
      description
      timestamp
      created_at
      updated_at
    }
    error
  }
}
```

---

### `delete_video_marker`
**Variables attendues :**
```json
{
  "markerId": "UUID"
}
```

**Exemple d’appel :**
```graphql
mutation($markerId: UUID!) {
  delete_video_marker(markerId: $markerId) {
    marker {
      id
      title
      description
      timestamp
      created_at
      updated_at
    }
    error
  }
}
```

---

## Mutations Auth

### `create_oauth_user`
**Variables attendues :**
```json
{
  "email": "String",
  "full_name": "String",
  "provider": "String",
  "provider_account_id": "String",
  "access_token": "String",
  "refresh_token": "String (optionnel)",
  "expires_at": "DateTime (optionnel)"
}
```

**Exemple d’appel :**
```graphql
mutation($email: String!, $full_name: String!, $provider: String!, $provider_account_id: String!, $access_token: String!, $refresh_token: String, $expires_at: DateTime) {
  create_oauth_user(
    email: $email,
    full_name: $full_name,
    provider: $provider,
    provider_account_id: $provider_account_id,
    access_token: $access_token,
    refresh_token: $refresh_token,
    expires_at: $expires_at
  ) {
    user {
      id
      email
      fullName
      isOauth
      isActive
      isSuperuser
      createdAt
      updatedAt
      oauthAccounts {
        id
        provider
        provider_account_id
        access_token
        refresh_token
        expires_at
        created_at
        updated_at
      }
    }
    error
    success
  }
}
```

---

### `create_user`
**Variables attendues :**
```json
{
  "email": "String",
  "password": "String",
  "full_name": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($email: String!, $password: String!, $full_name: String!) {
  create_user(email: $email, password: $password, full_name: $full_name) {
    user {
      id
      email
      fullName
      isOauth
      isActive
      isSuperuser
      createdAt
      updatedAt
      oauthAccounts {
        id
        provider
        provider_account_id
        access_token
        refresh_token
        expires_at
        created_at
        updated_at
      }
    }
    error
    success
  }
}
```

---

### `login`
**Variables attendues :**
```json
{
  "email": "String",
  "password": "String"
}
```

**Exemple d’appel :**
```graphql
mutation($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    error
  }
}
```

---
