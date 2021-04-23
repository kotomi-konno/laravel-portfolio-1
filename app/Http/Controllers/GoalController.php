<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Goal;


class GoalController extends Controller
{
    public function create(Request $request)
    {
        // return $request->completed;
        Goal::create([
            'name' => $request->name,
            'content' => $request->content,
            'deadline' => $request->deadline,
            'time' => $request->time,
            'completed' => $request->completed,
        ]);
    }

       public function read()
    {
       $data = Goal::get();
       return $data;

    //    return Goal::get(); でもいいよ！！
    }
}