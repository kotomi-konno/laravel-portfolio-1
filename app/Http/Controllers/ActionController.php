<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Action;

class ActionController extends Controller
{
    public function read()
    {
        $data = Action::get();
        return $data;
    }
}
