/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fse = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');

const TMP_PATH = path.join(__dirname, '../../../..', '.tmp', 'img');

/**
 * Downloads a file from the web or gets it from the cache
 * at TMP_PATH.
 * @param {String?} url The URL to download
 * @returns
 */
async function getFile(url) {
  const parsedUrl = new URL(url);
  const src = parsedUrl.pathname;

  let file = null;
  // For export we want to download the image, but only do so
  // if it is not yet cached.
  if (!fse.existsSync(path.join(TMP_PATH, src))) {
    file = await fetch(url);
    file = await file.buffer();
    await fse.outputFile(path.join(TMP_PATH, src), file);
  } else {
    file = await fse.readFile(path.join(TMP_PATH, src));
  }

  return file;
}

module.exports = {getFile};